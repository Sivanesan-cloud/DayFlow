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
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
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
app.get('/api/me', auth, (req, res) => res.json({ employee: req.employee }));
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
if (require.main === module) app.listen(PORT, () => console.log(`Dayflow API running on http://localhost:${PORT}`));
module.exports = app;
