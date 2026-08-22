import { useState } from 'react';
import LeaveApprovals from './LeaveApprovals';
import Attendance from './Attendance';

// ─── Icons (inline SVG so no extra deps) ────────────────────────────────────
const Icons = {
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  Employees: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Attendance: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Leave: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  Payroll: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  ),
  Reports: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  ),
  Export: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  ArrowRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  TotalEmp: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Present: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
      <polyline points="16 11 18 13 22 9" style={{stroke:'#0d9488'}}/>
    </svg>
  ),
  OnLeave: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Pending: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
    </svg>
  ),
};

// ─── Avatar placeholder ───────────────────────────────────────────────────────
const Avatar = ({ name, size = 32, bg = '#0d9488' }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: size * 0.38, fontWeight: 600, flexShrink: 0,
      letterSpacing: 0.5,
    }}>{initials}</div>
  );
};

// ─── Sidebar nav items ────────────────────────────────────────────────────────
const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
  { id: 'employees', label: 'Employees', icon: Icons.Employees },
  { id: 'attendance', label: 'Attendance', icon: Icons.Attendance },
  { id: 'leave', label: 'Leave', icon: Icons.Leave },
  { id: 'payroll', label: 'Payroll', icon: Icons.Payroll },
  { id: 'reports', label: 'Reports', icon: Icons.Reports },
];

// ─── Static data ──────────────────────────────────────────────────────────────
const recentEmployees = [
  { name: 'Sarah Jenkins', role: 'Product Designer', dept: 'Design', status: 'Active', bg: '#7c3aed' },
  { name: 'Michael Chen', role: 'Senior Engineer', dept: 'Engineering', status: 'Active', bg: '#0369a1' },
  { name: 'Elena Rodriguez', role: 'Marketing Specialist', dept: 'Marketing', status: 'Onboarding', bg: '#be185d' },
];

const actionRequired = [
  { name: 'David Kim', detail: 'Sick Leave • Oct 24', bg: '#0f766e' },
  { name: 'Priya Patel', detail: 'Vacation • Nov 1-5', bg: '#7c3aed' },
];

const recentCheckins = [
  { name: 'Sarah Jenkins', time: '08:45 AM', status: 'on-time' },
  { name: 'Michael Chen', time: '08:52 AM', status: 'on-time' },
  { name: 'David Kim', time: '09:15 AM', status: 'late' },
];

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const styles = {
    Active: { bg: '#dcfce7', color: '#16a34a', text: 'Active' },
    Onboarding: { bg: '#fef3c7', color: '#d97706', text: 'Onboarding' },
  };
  const s = styles[status] || styles.Active;
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: 11, fontWeight: 600,
      padding: '3px 10px', borderRadius: 20, letterSpacing: 0.2,
    }}>{s.text}</span>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f0f4f8',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 200, background: '#fff', borderRight: '1px solid #e8edf2',
        display: 'flex', flexDirection: 'column', padding: '24px 0',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10,
        boxShadow: '2px 0 8px rgba(0,0,0,0.04)',
      }}>

        {/* Admin profile */}
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid #f0f4f8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name="Admin Name" size={40} bg="#0d9488" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>Admin Name</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>HR Director</div>
            </div>
          </div>
        </div>

        {/* Brand */}
        <div style={{ padding: '20px 20px 8px' }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: '#0d9488', letterSpacing: -0.3 }}>
            Dayflow HRMS
          </div>
        </div>

        {/* Nav */}
        <nav style={{ marginTop: 8, flex: 1 }}>
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeNav === id;
            return (
              <button
                key={id}
                id={`nav-${id}`}
                onClick={() => setActiveNav(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '10px 20px', border: 'none',
                  background: active ? '#f0fdfb' : 'transparent',
                  color: active ? '#0d9488' : '#64748b',
                  fontWeight: active ? 600 : 500,
                  fontSize: 13.5, cursor: 'pointer', textAlign: 'left',
                  borderLeft: active ? '3px solid #0d9488' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon />
                {label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main Content ── */}
      <main style={{ marginLeft: 200, flex: 1, padding: '32px 28px', minHeight: '100vh' }}>
        {activeNav === 'attendance' ? (
          <Attendance />
        ) : activeNav === 'leave' ? (
          <LeaveApprovals />
        ) : (
          <>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#1e293b', letterSpacing: -0.5 }}>
              Overview
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
              Here's what's happening today.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button id="btn-export" style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
              border: '1.5px solid #cbd5e1', borderRadius: 8, background: '#fff',
              color: '#475569', fontSize: 13, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#0d9488'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#cbd5e1'}
            >
              <Icons.Export /> Export Report
            </button>
            <button id="btn-new-employee" style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px',
              border: 'none', borderRadius: 8, background: '#0d9488',
              color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#0f766e'}
              onMouseLeave={e => e.currentTarget.style.background = '#0d9488'}
            >
              <Icons.Plus /> New Employee
            </button>
          </div>
        </div>

        {/* ── Stats cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>

          {/* Total Employees */}
          <div style={cardStyle()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={labelStyle}>Total Employees</div>
                <div style={bigNumStyle}>124</div>
              </div>
              <div style={iconWrap('#f0fdfb')}>
                <Icons.TotalEmp />
              </div>
            </div>
          </div>

          {/* Present Today */}
          <div style={cardStyle()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={labelStyle}>Present Today</div>
                <div style={{ ...bigNumStyle, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  112
                  <span style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>↑90%</span>
                </div>
              </div>
              <div style={iconWrap('#f0fdfb')}>
                <Icons.Present />
              </div>
            </div>
          </div>

          {/* On Leave */}
          <div style={cardStyle()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={labelStyle}>On Leave</div>
                <div style={bigNumStyle}>8</div>
              </div>
              <div style={iconWrap('#fffbeb')}>
                <Icons.OnLeave />
              </div>
            </div>
          </div>

          {/* Pending Leave */}
          <div style={{ ...cardStyle(), border: '1.5px solid #fca5a5' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ ...labelStyle, color: '#dc2626' }}>Pending Leave</div>
                <div style={{ ...bigNumStyle, color: '#dc2626' }}>4</div>
              </div>
              <div style={iconWrap('#fef2f2')}>
                <Icons.Pending />
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>

          {/* Recent Employees table */}
          <div style={{ ...cardStyle(), padding: '20px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px 16px' }}>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1e293b' }}>Recent Employees</h2>
              <button id="btn-view-all" style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', color: '#0d9488',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                View All <Icons.ArrowRight />
              </button>
            </div>

            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1fr',
              padding: '8px 20px', borderTop: '1px solid #f1f5f9',
              borderBottom: '1px solid #f1f5f9', background: '#f8fafc',
            }}>
              {['Employee', 'Role', 'Department', 'Status'].map(h => (
                <div key={h} style={{ fontSize: 11.5, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</div>
              ))}
            </div>

            {/* Rows */}
            {recentEmployees.map((emp, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '2fr 2fr 2fr 1fr',
                padding: '14px 20px', alignItems: 'center',
                borderBottom: i < recentEmployees.length - 1 ? '1px solid #f1f5f9' : 'none',
                transition: 'background 0.12s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={emp.name} size={30} bg={emp.bg} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: '#0d9488' }}>{emp.name}</span>
                </div>
                <div style={{ fontSize: 13, color: '#0d9488' }}>{emp.role}</div>
                <div style={{ fontSize: 13, color: '#0d9488' }}>{emp.dept}</div>
                <div><StatusBadge status={emp.status} /></div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Action Required */}
            <div style={cardStyle()}>
              <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>🔔</span> Action Required
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {actionRequired.map((a, i) => (
                  <div key={i} style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                      <Avatar name={a.name} size={34} bg={a.bg} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{a.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b', marginTop: 1 }}>{a.detail}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                      <button style={actionBtn('reject')}><Icons.X /></button>
                      <button style={actionBtn('approve')}><Icons.Check /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Check-ins */}
            <div style={cardStyle()}>
              <h2 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 700, color: '#1e293b' }}>
                Recent Check-ins
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentCheckins.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                      background: c.status === 'late' ? '#f59e0b' : '#22c55e',
                    }} />
                    <div>
                      <div style={{ fontSize: 13, color: '#1e293b' }}>
                        <b>{c.name}</b> checked{c.status === 'late' ? ' in late' : ' in'}
                      </div>
                      <div style={{ fontSize: 11.5, color: '#94a3b8', marginTop: 1 }}>{c.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  );
}

// ─── Style helpers ────────────────────────────────────────────────────────────
function cardStyle() {
  return {
    background: '#fff', borderRadius: 14, padding: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #e8edf2',
  };
}
const labelStyle = { fontSize: 13, color: '#64748b', marginBottom: 6, fontWeight: 500 };
const bigNumStyle = { fontSize: 30, fontWeight: 800, color: '#1e293b', letterSpacing: -1 };
function iconWrap(bg) {
  return {
    width: 44, height: 44, borderRadius: 10, background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  };
}
function actionBtn(type) {
  return {
    width: 28, height: 28, borderRadius: 6,
    background: type === 'approve' ? '#f0fdfb' : '#fef2f2',
    border: type === 'approve' ? '1px solid #bbf7d0' : '1px solid #fecaca',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer',
  };
}
