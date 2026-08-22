import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { fetchAdminResource } from '../../lib/adminApi.js';

// ─── Icons ─────────────────────────────────────────────────────────────────
const Icons = {
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Pending: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  FileText: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  User: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

// ─── Avatar Placeholder ───────────────────────────────────────────────────
const Avatar = ({ name, size = 40, bg = '#0d9488' }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: size * 0.38, fontWeight: 600, flexShrink: 0,
      letterSpacing: 0.5, boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      {initials}
    </div>
  );
};

// ─── Static Data ─────────────────────────────────────────────────────────
const leaveRequests = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Product Designer',
    type: 'Annual Leave',
    startDate: '2026-08-25',
    endDate: '2026-08-29',
    days: 5,
    status: 'Approved',
    reason: 'Family vacation and attending a wedding out of town.',
    appliedOn: '2026-08-15',
    bg: '#7c3aed'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Senior Engineer',
    type: 'Sick Leave',
    startDate: '2026-08-21',
    endDate: '2026-08-22',
    days: 2,
    status: 'Approved',
    reason: 'Severe flu, advised to rest by the doctor.',
    appliedOn: '2026-08-20',
    bg: '#0369a1'
  },
  {
    id: 3,
    name: 'David Kim',
    role: 'Marketing Specialist',
    type: 'Personal Leave',
    startDate: '2026-09-01',
    endDate: '2026-09-02',
    days: 2,
    status: 'Rejected',
    reason: 'Moving to a new apartment downtown.',
    appliedOn: '2026-08-18',
    bg: '#0f766e'
  },
  {
    id: 4,
    name: 'Elena Rodriguez',
    role: 'Product Manager',
    type: 'Annual Leave',
    startDate: '2026-10-10',
    endDate: '2026-10-24',
    days: 15,
    status: 'Rejected',
    reason: 'Extended European tour across multiple countries.',
    appliedOn: '2026-08-19',
    bg: '#be185d'
  },
  {
    id: 5,
    name: 'James Wilson',
    role: 'Backend Developer',
    type: 'Paternity Leave',
    startDate: '2026-11-01',
    endDate: '2026-11-14',
    days: 14,
    status: 'Pending',
    reason: 'Expecting a new baby, requesting time off to support my family.',
    appliedOn: '2026-08-21',
    bg: '#ea580c'
  },
];

// ─── Main Component ──────────────────────────────────────────────────────
export default function LeaveApprovals() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('Pending');
  const [comments, setComments] = useState({});
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchAdminResource('leaves', currentUser).then(rows => setRequests(rows.map(request => ({
      ...request,
      id: request.leave_id,
      name: `${request.first_name} ${request.last_name}`,
      role: request.job_title || request.role_name,
      type: `${request.leave_type} Leave`,
      startDate: new Date(request.start_date).toLocaleDateString(),
      endDate: new Date(request.end_date).toLocaleDateString(),
      days: Math.ceil((new Date(request.end_date) - new Date(request.start_date)) / 86400000) + 1,
      reason: request.remarks || 'No reason provided',
      appliedOn: request.created_at ? new Date(request.created_at).toLocaleDateString() : '—',
      bg: '#0d9488',
    })))).catch(() => setRequests([]));
  }, [currentUser]);

  const filteredRequests = requests.filter(req => req.status === activeTab);

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      animation: 'fadeIn 0.3s ease-in-out',
      width: '100%'
    }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1e293b', letterSpacing: -0.5 }}>
          Leave Approvals
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
          View and manage approved and rejected employee leave requests.
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', gap: 20, borderBottom: '1px solid #e2e8f0', marginBottom: 24
      }}>
        {['Pending', 'Approved', 'Rejected'].map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '10px 4px', fontSize: 14, fontWeight: isActive ? 600 : 500,
                color: isActive ? '#0d9488' : '#64748b',
                borderBottom: `2.5px solid ${isActive ? '#0d9488' : 'transparent'}`,
                transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              {tab === 'Approved' ? <Icons.Check /> : tab === 'Rejected' ? <Icons.X /> : <Icons.Pending />}
              {tab}
            </button>
          );
        })}
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
        {filteredRequests.length > 0 ? (
          filteredRequests.map(req => (
            <div key={req.id} style={{
              background: '#fff',
              borderRadius: 12,
              padding: 24,
              border: '1px solid #e8edf2',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              position: 'relative',
              overflow: 'hidden'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, width: 4, height: '100%',
                background: activeTab === 'Approved' ? '#10b981' : activeTab === 'Rejected' ? '#f43f5e' : '#f59e0b'
              }} />

              {/* Header: Avatar + User Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Avatar name={req.name} size={48} bg={req.bg} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#1e293b' }}>{req.name}</div>
                    <div style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <Icons.User /> {req.role}
                    </div>
                  </div>
                </div>
                <div style={{
                  background: activeTab === 'Approved' ? '#dcfce7' : activeTab === 'Rejected' ? '#ffe4e6' : '#fef3c7',
                  color: activeTab === 'Approved' ? '#16a34a' : activeTab === 'Rejected' ? '#e11d48' : '#d97706',
                  fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                  textTransform: 'uppercase', letterSpacing: 0.5
                }}>
                  {req.status}
                </div>
              </div>

              {/* Leave Info */}
              <div style={{ background: '#f8fafc', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Leave Type</span>
                  <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600 }}>{req.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Duration</span>
                  <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icons.Calendar /> {req.startDate} to {req.endDate} ({req.days} days)
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Applied On</span>
                  <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 500 }}>{req.appliedOn}</span>
                </div>
              </div>

              {/* Reason */}
              <div style={{ marginBottom: activeTab === 'Pending' ? 16 : 0 }}>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icons.FileText /> Reason
                </div>
                <div style={{ fontSize: 13.5, color: '#334155', lineHeight: 1.5 }}>
                  "{req.reason}"
                </div>
              </div>

              {/* Pending Actions — Approve / Reject + Comment */}
              {activeTab === 'Pending' && (
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                  {/* Rejection comment box */}
                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                      Rejection Reason (optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Add a comment before rejecting..."
                      value={comments[req.id] || ''}
                      onChange={e => setComments(prev => ({ ...prev, [req.id]: e.target.value }))}
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        border: '1.5px solid #e2e8f0', borderRadius: 8,
                        padding: '8px 10px', fontSize: 13, color: '#334155',
                        resize: 'none', fontFamily: 'inherit',
                        outline: 'none', transition: 'border-color 0.2s',
                        lineHeight: 1.5,
                      }}
                      onFocus={e => e.target.style.borderColor = '#0d9488'}
                      onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                    />
                  </div>
                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      style={{
                        flex: 1, padding: '9px 0', borderRadius: 8, border: '1.5px solid #bbf7d0',
                        background: '#f0fdfb', color: '#0f766e', fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#ccfbf1'}
                      onMouseLeave={e => e.currentTarget.style.background = '#f0fdfb'}
                    >
                      <Icons.Check /> Approve
                    </button>
                    <button
                      style={{
                        flex: 1, padding: '9px 0', borderRadius: 8, border: '1.5px solid #fecaca',
                        background: '#fff5f5', color: '#dc2626', fontSize: 13, fontWeight: 700,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fff5f5'}
                    >
                      <Icons.X /> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div style={{
            gridColumn: '1 / -1', padding: '60px 20px', textAlign: 'center',
            background: '#fff', borderRadius: 12, border: '1px dashed #cbd5e1'
          }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#64748b', marginBottom: 4 }}>
              No {activeTab.toLowerCase()} leave requests found
            </div>
            <div style={{ fontSize: 14, color: '#94a3b8' }}>
              When a request is {activeTab.toLowerCase()}, it will appear here.
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
