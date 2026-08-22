import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchEmployeeData } from '../../lib/adminApi.js';
import './employee-dashboard.css';

const navItems = [
  ['□', 'Dashboard'],
  ['○', 'Attendance'],
  ['▢', 'Leave'],
  ['▣', 'Payroll'],
  ['▤', 'Documents'],
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, profile, currentUser } = useAuth();
  const [data, setData] = useState({ attendance: [], leaves: [], payroll: [] });
  useEffect(() => { if (profile?.employee?.employee_id) fetchEmployeeData(currentUser, profile.employee.employee_id).then(setData).catch(() => {}); }, [currentUser, profile]);
  const today = data.attendance[0];
  const latestPayroll = data.payroll[0];
  const initials = (profile?.fullName || currentUser?.displayName || 'Dayflow User')
    .split(' ')
    .map((name) => name[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <main className="employee-portal">
      <aside className="employee-sidebar">
        <div className="portal-brand">
          <strong>Dayflow</strong>
          <small>HR Portal</small>
        </div>
        <nav>
          {navItems.map(([icon, label], index) => (
            <button className={index === 0 ? 'selected' : ''} key={label} type="button">
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </nav>
        <button className="logout" type="button" onClick={handleLogout}>
          <span>↥</span> Log Out
        </button>
      </aside>

      <section className="portal-content">
        <header className="portal-header">
          <button className="menu-toggle" type="button">☰</button>
          <div>
            <button type="button">♧</button>
            <button type="button">⚙</button>
            <button type="button">?</button>
            <span className="avatar mini-avatar">{initials}</span>
          </div>
        </header>

        <section className="employee-profile card">
          <span className="avatar">{initials}</span>
          <div className="profile-name">
            <h1>{profile?.fullName || 'Employee'}</h1>
            <p>{profile?.role === 'admin' ? 'HR / Admin' : 'Employee'} • Dayflow Team</p>
          </div>
          <div className="profile-meta">
            <span>
              Employee ID<b>{profile?.employeeId || 'Pending'}</b>
            </span>
            <span>
              Email<b>{profile?.email || currentUser?.email || 'Not set'}</b>
            </span>
          </div>
        </section>

        <div className="dashboard-grid">
          <section className="attendance card">
            <div className="card-heading">
              <div>
                <h2>◷ Today's Attendance</h2>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
              <button className="checkin" type="button">◉ &nbsp; Check In</button>
            </div>
            <div className="attendance-bar"><i style={{ background: today?.check_in_time ? '#008a7f' : '#d3b0a8' }} /><i /><i /><i /><i /></div>
          </section>

          <section className="payout card">
            <h2>£ Last Payout</h2>
            <p>{latestPayroll?.effective_date ? new Date(latestPayroll.effective_date).toLocaleDateString() : 'No payroll record'}</p>
            <strong>₹{Number(latestPayroll?.net_salary || 0).toLocaleString('en-IN')}</strong>
            <a href="#payout-history">View Payslip History</a>
          </section>

          <section className="leave-card card">
            <div className="card-heading">
              <h2>Leave Balances</h2>
              <button className="apply" type="button">Apply</button>
            </div>
            <div className="leave-row">
              <div>
                <b>Annual Leave</b>
                <span>Available</span>
              </div>
              <em>{Math.max(0, 12 - data.leaves.filter(leave => leave.leave_type === 'Paid').length)} Days</em>
            </div>
            <div className="leave-row">
              <div>
                <b>Sick Leave</b>
                <span>Available</span>
              </div>
              <em className="low">{Math.max(0, 4 - data.leaves.filter(leave => leave.leave_type === 'Sick').length)} Days</em>
            </div>
          </section>

          <section className="activity card">
            <h2>Activity</h2>
            <div className="timeline">
              <div>
                <span>◉</span>
                <p>{data.leaves.filter(leave => leave.status === 'Pending').length} pending leave request(s)<small>From PostgreSQL</small></p>
              </div>
              <div>
                <span>⌁</span>
                <p>{data.leaves.filter(leave => leave.status === 'Approved').length} approved leave request(s)<small>From PostgreSQL</small></p>
              </div>
            </div>
          </section>

          <section className="quick-docs card">
            <h2>Quick Docs</h2>
            <div>
              <button type="button">♙<small>Company<br />Policy</small></button>
              <button type="button">♢<small>Benefits<br />Guide</small></button>
              <button type="button">▧<small>Tax<br />Form (W4)</small></button>
              <button type="button">•••<small>View<br />All</small></button>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

