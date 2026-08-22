const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const db = require('./db');
require('dotenv').config();

if (!admin.apps.length) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw) admin.initializeApp({ credential: admin.credential.cert(JSON.parse(raw)) });
  else admin.initializeApp();
}
const app = express();
app.use(cors({ origin: process.env.DEV_AUTH_BYPASS === 'true' ? true : (process.env.CLIENT_ORIGIN || true) }));
app.use(express.json());
const fail = (status, message) => Object.assign(new Error(message), { status });
const nameParts = (name = '') => { const p = name.trim().split(/\s+/).filter(Boolean); return [p.shift() || 'Employee', p.join(' ') || 'User']; };
const dbRole = role => role === 'admin' ? 'Admin' : role === 'hr' ? 'HR Officer' : 'Employee';

async function readToken(req) {
  const value = req.headers.authorization || '';
  if (!value.startsWith('Bearer ')) throw fail(401, 'Bearer token required');
  return admin.auth().verifyIdToken(value.slice(7));
}
async function verifyToken(req, _res, next) { try { req.firebaseUser = await readToken(req); next(); } catch (error) { next(error.status ? error : fail(401, 'Invalid or expired Firebase token')); } }
async function auth(req, _res, next) { try { req.firebaseUser = await readToken(req); const result = await db.query('SELECT e.*, r.role_name FROM employees e JOIN roles r ON r.role_id=e.role_id WHERE e.firebase_uid=$1', [req.firebaseUser.uid]); if (!result.rows[0]) throw fail(403, 'Employee profile is not registered'); req.employee = result.rows[0]; next(); } catch (error) { next(error.status ? error : fail(401, 'Invalid or expired Firebase token')); } }
const staff = (req, _res, next) => ['Admin', 'HR Officer'].includes(req.employee.role_name) ? next() : next(fail(403, 'Admin or HR Officer access required'));

app.get('/api/health', async (_req, res, next) => { try { const r = await db.query('SELECT NOW()'); res.json({ status: 'ok', db_time: r.rows[0].now }); } catch (e) { next(e); } });
app.post('/api/auth/profile', verifyToken, async (req, res, next) => { try { const { employeeCode, fullName, role = 'employee', email } = req.body; if (!employeeCode || !fullName || !email) throw fail(400, 'employeeCode, fullName and email are required'); const [first, last] = nameParts(fullName); const r = await db.query('INSERT INTO employees (firebase_uid,employee_code,email,role_id,first_name,last_name) SELECT $1,$2,$3,role_id,$4,$5 FROM roles WHERE role_name=$6 RETURNING *', [req.firebaseUser.uid, employeeCode, email.toLowerCase(), first, last, dbRole(role)]); if (!r.rows[0]) throw fail(400, 'Invalid role'); res.status(201).json({ employee: r.rows[0] }); } catch (e) { next(e.code === '23505' ? fail(409, 'Employee code or email is already registered') : e); } });
app.post('/api/dev/login', async (req, res, next) => { try { if (process.env.NODE_ENV === 'production' || process.env.DEV_AUTH_BYPASS !== 'true') throw fail(404, 'Not found'); const email = String(req.body.email || '').trim().toLowerCase(); if (!email) throw fail(400, 'Email is required'); const r = await db.query('SELECT e.*, r.role_name FROM employees e JOIN roles r ON r.role_id=e.role_id WHERE LOWER(e.email)=$1', [email]); if (!r.rows[0]) throw fail(401, 'No PostgreSQL employee profile exists for this email'); res.json({ employee: r.rows[0] }); } catch (e) { next(e); } });
app.get('/api/me', auth, (req, res) => res.json({ employee: req.employee }));
app.get('/api/me/data', auth, async (req, res, next) => { try { const id = req.employee.employee_id; const [attendance, leaves, payroll] = await Promise.all([db.query('SELECT * FROM attendance WHERE employee_id=$1 ORDER BY work_date DESC', [id]), db.query('SELECT * FROM leave_requests WHERE employee_id=$1 ORDER BY created_at DESC', [id]), db.query('SELECT * FROM payroll WHERE employee_id=$1 ORDER BY effective_date DESC', [id])]); res.json({ attendance: attendance.rows, leaves: leaves.rows, payroll: payroll.rows }); } catch (e) { next(e); } });
async function dashboardData() {
  const [stats, employees, actions, checkins] = await Promise.all([
    db.query(`SELECT (SELECT COUNT(*)::int FROM employees) AS total_employees,
      (SELECT COUNT(*)::int FROM attendance WHERE work_date=CURRENT_DATE AND status='Present') AS present_today,
      (SELECT COUNT(DISTINCT employee_id)::int FROM leave_requests WHERE status='Approved' AND CURRENT_DATE BETWEEN start_date AND end_date) AS on_leave,
      (SELECT COUNT(*)::int FROM leave_requests WHERE status='Pending') AS pending_leave`),
    db.query(`SELECT e.employee_id, e.first_name, e.last_name, e.employee_code, e.department, r.role_name, e.created_at
      FROM employees e JOIN roles r ON r.role_id=e.role_id ORDER BY e.created_at DESC LIMIT 3`),
    db.query(`SELECT l.leave_id, l.leave_type, l.start_date, l.end_date, l.remarks, e.first_name, e.last_name
      FROM leave_requests l JOIN employees e ON e.employee_id=l.employee_id WHERE l.status='Pending' ORDER BY l.created_at DESC LIMIT 3`),
    db.query(`SELECT a.attendance_id, a.check_in_time, a.status, e.first_name, e.last_name
      FROM attendance a JOIN employees e ON e.employee_id=a.employee_id WHERE a.work_date=CURRENT_DATE AND a.check_in_time IS NOT NULL ORDER BY a.check_in_time DESC LIMIT 3`),
  ]);
  return { stats: stats.rows[0], employees: employees.rows, actions: actions.rows, checkins: checkins.rows };
}
app.get('/api/admin/dashboard', auth, staff, async (_req, res, next) => { try { res.json(await dashboardData()); } catch (e) { next(e); } });
app.get('/api/dev/dashboard', async (_req, res, next) => { try { if (process.env.NODE_ENV === 'production' || process.env.DEV_AUTH_BYPASS !== 'true') throw fail(404, 'Not found'); res.json(await dashboardData()); } catch (e) { next(e); } });
const adminResourceQueries = {
  employees: `SELECT e.*, r.role_name FROM employees e JOIN roles r ON r.role_id=e.role_id ORDER BY e.employee_id`,
  attendance: `SELECT a.*, e.first_name, e.last_name, e.department FROM attendance a JOIN employees e ON e.employee_id=a.employee_id ORDER BY a.work_date DESC, a.check_in_time DESC`,
  leaves: `SELECT l.*, e.first_name, e.last_name, e.job_title, r.role_name FROM leave_requests l JOIN employees e ON e.employee_id=l.employee_id JOIN roles r ON r.role_id=e.role_id ORDER BY l.created_at DESC`,
  payroll: `SELECT p.*, e.first_name, e.last_name, e.employee_code, e.department FROM payroll p JOIN employees e ON e.employee_id=p.employee_id ORDER BY p.effective_date DESC, e.employee_id`,
};
for (const resource of Object.keys(adminResourceQueries)) {
  app.get(`/api/admin/${resource}`, auth, staff, async (_req, res, next) => { try { const r = await db.query(adminResourceQueries[resource]); res.json({ [resource]: r.rows }); } catch (e) { next(e); } });
  app.get(`/api/dev/admin/${resource}`, async (_req, res, next) => { try { if (process.env.NODE_ENV === 'production' || process.env.DEV_AUTH_BYPASS !== 'true') throw fail(404, 'Not found'); const r = await db.query(adminResourceQueries[resource]); res.json({ [resource]: r.rows }); } catch (e) { next(e); } });
}
app.get('/api/dev/employee-data/:employeeId', async (req, res, next) => { try { if (process.env.NODE_ENV === 'production' || process.env.DEV_AUTH_BYPASS !== 'true') throw fail(404, 'Not found'); const id = Number(req.params.employeeId); const [attendance, leaves, payroll] = await Promise.all([db.query('SELECT * FROM attendance WHERE employee_id=$1 ORDER BY work_date DESC', [id]), db.query('SELECT * FROM leave_requests WHERE employee_id=$1 ORDER BY created_at DESC', [id]), db.query('SELECT * FROM payroll WHERE employee_id=$1 ORDER BY effective_date DESC', [id])]); res.json({ attendance: attendance.rows, leaves: leaves.rows, payroll: payroll.rows }); } catch (e) { next(e); } });
app.patch('/api/me', auth, async (req, res, next) => { try { const keys = ['phone_number', 'address', 'profile_picture_url'].filter(k => Object.hasOwn(req.body, k)); if (!keys.length) throw fail(400, 'Only phone_number, address and profile_picture_url can be edited'); const values = keys.map(k => req.body[k]); const set = keys.map((k, i) => `${k}=$${i + 1}`).join(','); const r = await db.query(`UPDATE employees SET ${set},updated_at=CURRENT_TIMESTAMP WHERE employee_id=$${values.length + 1} RETURNING *`, [...values, req.employee.employee_id]); res.json({ employee: r.rows[0] }); } catch (e) { next(e); } });
app.get('/api/employees', auth, staff, async (_req, res, next) => { try { const r = await db.query('SELECT e.*,r.role_name FROM employees e JOIN roles r ON r.role_id=e.role_id ORDER BY e.employee_id'); res.json({ employees: r.rows }); } catch (e) { next(e); } });
app.get('/api/attendance', auth, async (req, res, next) => { try { const r = await db.query('SELECT * FROM attendance WHERE employee_id=$1 ORDER BY work_date DESC', [req.employee.employee_id]); res.json({ attendance: r.rows }); } catch (e) { next(e); } });
app.post('/api/attendance/check-in', auth, async (req, res, next) => { try { const r = await db.query("INSERT INTO attendance(employee_id,work_date,check_in_time,status) VALUES($1,CURRENT_DATE,LOCALTIME,'Present') ON CONFLICT(employee_id,work_date) DO UPDATE SET check_in_time=COALESCE(attendance.check_in_time,EXCLUDED.check_in_time),status='Present' RETURNING *", [req.employee.employee_id]); res.json({ attendance: r.rows[0] }); } catch (e) { next(e); } });
app.post('/api/attendance/check-out', auth, async (req, res, next) => { try { const r = await db.query('UPDATE attendance SET check_out_time=LOCALTIME WHERE employee_id=$1 AND work_date=CURRENT_DATE RETURNING *', [req.employee.employee_id]); if (!r.rows[0]) throw fail(400, 'Check in before checking out'); res.json({ attendance: r.rows[0] }); } catch (e) { next(e); } });
app.get('/api/leaves', auth, async (req, res, next) => { try { const r = await db.query('SELECT * FROM leave_requests WHERE employee_id=$1 ORDER BY created_at DESC', [req.employee.employee_id]); res.json({ leaves: r.rows }); } catch (e) { next(e); } });
app.post('/api/leaves', auth, async (req, res, next) => { try { const { leaveType, startDate, endDate, remarks } = req.body; if (!['Paid','Sick','Unpaid'].includes(leaveType) || !startDate || !endDate) throw fail(400, 'Valid leaveType, startDate and endDate are required'); const r = await db.query('INSERT INTO leave_requests(employee_id,leave_type,start_date,end_date,remarks) VALUES($1,$2,$3,$4,$5) RETURNING *', [req.employee.employee_id, leaveType, startDate, endDate, remarks || null]); res.status(201).json({ leave: r.rows[0] }); } catch (e) { next(e); } });
app.get('/api/payroll', auth, async (req, res, next) => { try { const r = await db.query('SELECT * FROM payroll WHERE employee_id=$1 ORDER BY effective_date DESC', [req.employee.employee_id]); res.json({ payroll: r.rows }); } catch (e) { next(e); } });
app.use((error, _req, res, _next) => res.status(error.status || 500).json({ error: error.message || 'Internal server error' }));
const PORT = Number(process.env.PORT || 5000);
if (require.main === module) app.listen(PORT, '0.0.0.0', () => console.log(`Dayflow API running on port ${PORT}`));
module.exports = app;
