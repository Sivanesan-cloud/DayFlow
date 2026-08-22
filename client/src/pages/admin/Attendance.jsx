import { useState } from 'react';

// ─── Icons ─────────────────────────────────────────────────────────────────
const Icons = {
  Export: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  )
};

// ─── Avatar Placeholder ───────────────────────────────────────────────────
const Avatar = ({ name, size = 36, bg = '#0d9488' }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: size * 0.35, fontWeight: 600, flexShrink: 0,
      letterSpacing: 0.5
    }}>
      {initials}
    </div>
  );
};

// ─── Status Badge ────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  let style = {};
  if (status === 'Present') {
    style = { bg: '#ccfbf1', color: '#0f766e', dot: '#14b8a6' };
  } else if (status === 'Late') {
    style = { bg: '#ffedd5', color: '#c2410c', dot: '#f59e0b' };
  } else if (status === 'Absent') {
    style = { bg: '#fee2e2', color: '#b91c1c', dot: '#ef4444' };
  }

  return (
    <div style={{
      background: style.bg,
      color: style.color,
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: 11.5,
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: style.dot }} />
      {status}
    </div>
  );
};

// ─── Dummy Data ──────────────────────────────────────────────────────────
const attendanceData = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    dept: 'Engineering',
    date: 'Oct 24, 2023',
    checkIn: '08:55 AM',
    checkOut: '05:05 PM',
    status: 'Present',
    bg: '#cbd5e1'
  },
  {
    id: 2,
    name: 'Marcus Chen',
    dept: 'Design',
    date: 'Oct 24, 2023',
    checkIn: '09:30 AM',
    checkOut: '--:--',
    status: 'Late',
    bg: '#94a3b8'
  },
  {
    id: 3,
    name: 'Elena Wright',
    dept: 'Marketing',
    date: 'Oct 24, 2023',
    checkIn: '--:--',
    checkOut: '--:--',
    status: 'Absent',
    bg: '#64748b'
  }
];

// ─── Main Component ──────────────────────────────────────────────────────
export default function Attendance() {
  const [activeToggle, setActiveToggle] = useState('Daily');

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      width: '100%',
      animation: 'fadeIn 0.3s ease-in-out'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1e293b', letterSpacing: -0.5 }}>
            Attendance Management
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
            Monitor and manage employee daily logs.
          </p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', background: '#fff', border: '1px solid #cbd5e1',
          borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#475569',
          cursor: 'pointer'
        }}>
          <Icons.Export /> Export
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: '#f8fafc',
        borderRadius: 12,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
      }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {/* Date Picker Mock */}
          <div style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
            padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 13, color: '#1e293b', fontWeight: 500, minWidth: 140
          }}>
            <Icons.Calendar />
            <span>24-10-2023</span>
          </div>
          
          {/* Dropdown Mock */}
          <div style={{
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
            padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 13, color: '#1e293b', fontWeight: 500, minWidth: 150, justifyContent: 'space-between'
          }}>
            All Departments
            <Icons.ChevronDown />
          </div>
        </div>

        {/* Toggle daily/weekly */}
        <div style={{
          background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
          display: 'flex', padding: 4
        }}>
          {['Daily', 'Weekly'].map(item => (
            <button
              key={item}
              onClick={() => setActiveToggle(item)}
              style={{
                background: activeToggle === item ? '#0f766e' : 'transparent',
                color: activeToggle === item ? '#fff' : '#64748b',
                border: 'none', borderRadius: 6, padding: '6px 16px',
                fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden'
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 1.2fr 1fr 1fr',
          padding: '12px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
          fontSize: 12, fontWeight: 600, color: '#64748b'
        }}>
          <div>Employee</div>
          <div>Date</div>
          <div>Check In</div>
          <div>Check Out</div>
          <div>Status</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {attendanceData.map((row, i) => (
            <div key={row.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 1.5fr 1.2fr 1.2fr 1fr 1fr',
              padding: '16px 24px', alignItems: 'center',
              borderBottom: i < attendanceData.length - 1 ? '1px solid #f1f5f9' : 'none',
              fontSize: 13.5, color: '#334155', fontWeight: 500
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={row.name} bg={row.bg} />
                <div>
                  <div style={{ color: '#1e293b', fontWeight: 600 }}>{row.name}</div>
                  <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>{row.dept}</div>
                </div>
              </div>
              <div style={{ color: '#64748b' }}>{row.date}</div>
              <div style={{ color: row.status === 'Late' ? '#ef4444' : '#334155' }}>{row.checkIn}</div>
              <div>{row.checkOut}</div>
              <div>
                <StatusBadge status={row.status} />
              </div>
              <div style={{ textAlign: 'right' }}>
                {/* Empty Actions in Mock */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
