const { Pool } = require('pg');
require('dotenv').config();

const config = { user: process.env.DB_USER || 'postgres', host: process.env.DB_HOST || 'localhost', password: process.env.DB_PASSWORD || '', port: Number(process.env.DB_PORT || 5432), database: process.env.DB_NAME || 'dayflow_db' };
const schema = `
CREATE TABLE IF NOT EXISTS roles (role_id SERIAL PRIMARY KEY, role_name VARCHAR(50) UNIQUE NOT NULL);
CREATE TABLE IF NOT EXISTS employees (employee_id SERIAL PRIMARY KEY, firebase_uid VARCHAR(128) UNIQUE NOT NULL, employee_code VARCHAR(50) UNIQUE NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, role_id INT REFERENCES roles(role_id) ON DELETE RESTRICT, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, phone_number VARCHAR(20), address TEXT, profile_picture_url TEXT, job_title VARCHAR(100), department VARCHAR(100), date_of_joining DATE DEFAULT CURRENT_DATE, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS attendance (attendance_id SERIAL PRIMARY KEY, employee_id INT REFERENCES employees(employee_id) ON DELETE CASCADE, work_date DATE NOT NULL DEFAULT CURRENT_DATE, check_in_time TIME, check_out_time TIME, status VARCHAR(20) CHECK (status IN ('Present','Absent','Half-day','Leave')), UNIQUE (employee_id, work_date));
CREATE TABLE IF NOT EXISTS leave_requests (leave_id SERIAL PRIMARY KEY, employee_id INT REFERENCES employees(employee_id) ON DELETE CASCADE, leave_type VARCHAR(20) CHECK (leave_type IN ('Paid','Sick','Unpaid')), start_date DATE NOT NULL, end_date DATE NOT NULL, remarks TEXT, status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Rejected')), reviewed_by INT REFERENCES employees(employee_id) ON DELETE SET NULL, admin_comments TEXT, created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP, CHECK (end_date >= start_date));
CREATE TABLE IF NOT EXISTS payroll (payroll_id SERIAL PRIMARY KEY, employee_id INT REFERENCES employees(employee_id) ON DELETE CASCADE, basic_salary NUMERIC(10,2) NOT NULL DEFAULT 0.00, allowances NUMERIC(10,2) DEFAULT 0.00, deductions NUMERIC(10,2) DEFAULT 0.00, net_salary NUMERIC(10,2) GENERATED ALWAYS AS (basic_salary + allowances - deductions) STORED, effective_date DATE NOT NULL, updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS documents (document_id SERIAL PRIMARY KEY, employee_id INT REFERENCES employees(employee_id) ON DELETE CASCADE, document_name VARCHAR(255) NOT NULL, file_url TEXT NOT NULL, uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);
INSERT INTO roles (role_name) VALUES ('Admin'), ('HR Officer'), ('Employee') ON CONFLICT (role_name) DO NOTHING;`;
async function seed() {
  const pool = new Pool(config);
  try {
    await pool.query(schema);
    const employees = [
      ['demo-admin-001', 'DF-1001', 'admin@demo.dayflow.local', 'Admin', 'Aarav', 'Sharma', '9999000001', 'HR Director', 'Human Resources'],
      ['demo-hr-002', 'DF-1002', 'hr@demo.dayflow.local', 'HR Officer', 'Priya', 'Nair', '9999000002', 'HR Officer', 'Human Resources'],
      ['demo-employee-003', 'DF-1003', 'employee1@demo.dayflow.local', 'Employee', 'Vishnu', 'Kumar', '9999000003', 'Software Engineer', 'Engineering'],
      ['demo-employee-004', 'DF-1004', 'employee2@demo.dayflow.local', 'Employee', 'Ananya', 'Reddy', '9999000004', 'Product Designer', 'Design'],
      ['demo-employee-005', 'DF-1005', 'employee3@demo.dayflow.local', 'Employee', 'Rohan', 'Mehta', '9999000005', 'Sales Executive', 'Sales'],
    ];
    for (const employee of employees) {
      await pool.query(`INSERT INTO employees (firebase_uid, employee_code, email, role_id, first_name, last_name, phone_number, job_title, department)
        SELECT $1,$2,$3,role_id,$5,$6,$7,$8,$9 FROM roles WHERE role_name=$4
        ON CONFLICT (firebase_uid) DO NOTHING`, employee);
    }
    await pool.query(`INSERT INTO attendance (employee_id, work_date, check_in_time, check_out_time, status)
      SELECT employee_id, CURRENT_DATE, '09:00', '17:30', 'Present' FROM employees WHERE employee_code IN ('DF-1003','DF-1004','DF-1005')
      ON CONFLICT (employee_id, work_date) DO NOTHING`);
    await pool.query(`INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, remarks, status)
      SELECT employee_id, 'Paid', CURRENT_DATE + 5, CURRENT_DATE + 6, 'Personal work', 'Pending' FROM employees WHERE employee_code='DF-1003'
      AND NOT EXISTS (SELECT 1 FROM leave_requests l WHERE l.employee_id=employees.employee_id AND l.remarks='Personal work')`);
    await pool.query(`INSERT INTO leave_requests (employee_id, leave_type, start_date, end_date, remarks, status)
      SELECT employee_id, 'Sick', CURRENT_DATE - 2, CURRENT_DATE - 1, 'Medical leave', 'Approved' FROM employees WHERE employee_code='DF-1004'
      AND NOT EXISTS (SELECT 1 FROM leave_requests l WHERE l.employee_id=employees.employee_id AND l.remarks='Medical leave')`);
    await pool.query(`INSERT INTO payroll (employee_id, basic_salary, allowances, deductions, effective_date)
      SELECT employee_id, salary, 5000, 1500, CURRENT_DATE FROM (VALUES
        ('DF-1001',120000),('DF-1002',80000),('DF-1003',65000),('DF-1004',60000),('DF-1005',55000)
      ) AS demo(employee_code,salary) JOIN employees USING (employee_code)
      WHERE NOT EXISTS (SELECT 1 FROM payroll p WHERE p.employee_id=employees.employee_id AND p.effective_date=CURRENT_DATE)`);
    await pool.query(`INSERT INTO documents (employee_id, document_name, file_url)
      SELECT employee_id, 'Employment Agreement.pdf', 'https://example.com/demo/employment-agreement.pdf' FROM employees WHERE employee_code='DF-1003'
      AND NOT EXISTS (SELECT 1 FROM documents d WHERE d.employee_id=employees.employee_id AND d.document_name='Employment Agreement.pdf')`);
    console.log('Dayflow schema and demo data are ready.');
  } catch (error) { console.error('Database setup failed:', error.message); process.exitCode = 1; } finally { await pool.end(); }
}
if (require.main === module) seed();
module.exports = { schema };
