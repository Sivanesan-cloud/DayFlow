const payrollRows = [
  ['Engineering', 125000, 75, '#00796b'],
  ['Sales', 85000, 55, '#00897b'],
  ['Marketing', 60000, 40, '#00796b'],
  ['Human Resources', 45000, 25, '#5ed6cb'],
];

const leaveSegments = [
  { label: 'Paid Leave', value: 60, color: '#00796b' },
  { label: 'Sick Leave', value: 25, color: '#c8d1df' },
  { label: 'Unpaid', value: 15, color: '#ffd6d6', border: '#f87171' },
];

const Icons = {
  Download: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  File: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  ),
  Bell: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  More: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" />
    </svg>
  ),
};

function AttendanceChart() {
  const points = [
    [40, 95],
    [175, 115],
    [310, 70],
    [445, 105],
    [580, 58],
    [715, 82],
  ];
  const path = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const fillPath = `${path} L 715 230 L 40 230 Z`;

  return (
    <svg viewBox="0 0 760 260" width="100%" height="210" style={{ display: 'block' }}>
      {[90, 170, 245].map((y, index) => (
        <g key={y}>
          <text x="0" y={y + 4} fontSize="12" fill="#16334f">{index === 0 ? '100%' : index === 1 ? '95%' : '90%'}</text>
          <line x1="38" y1={y} x2="735" y2={y} stroke="#eef2f7" strokeWidth="1" />
        </g>
      ))}
      <path d={fillPath} fill="#e9f5f3" />
      <path d={path} fill="none" stroke="#00897b" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((label, index) => (
        <text key={label} x={index * 220 + 45} y="255" fontSize="12" fill="#16334f">{label}</text>
      ))}
    </svg>
  );
}

function LeaveDonut() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', gap: 18 }}>
      <div style={{ position: 'relative', width: 126, height: 126 }}>
        <div style={{
          width: 126,
          height: 126,
          borderRadius: '50%',
          background: 'conic-gradient(#00796b 0 60%, #c8d1df 60% 85%, #ffd6d6 85% 100%)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 25,
          borderRadius: '50%',
          background: '#fff',
          display: 'grid',
          placeItems: 'center',
          color: '#06192f',
          fontSize: 22,
          fontWeight: 900,
        }}>
          142
        </div>
      </div>
      <div style={{ width: '100%', display: 'grid', gap: 10 }}>
        {leaveSegments.map(segment => (
          <div key={segment.label} style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 14, fontSize: 13, color: '#06192f' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
              <i style={{ width: 10, height: 10, borderRadius: '50%', background: segment.color, border: segment.border ? `1px solid ${segment.border}` : 0 }} />
              {segment.label}
            </span>
            <b>{segment.value}%</b>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reports() {
  return (
    <div style={{ color: '#06192f', fontFamily: "'Inter', system-ui, sans-serif", animation: 'fadeIn 0.25s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 18, borderBottom: '1px solid #d8dee8' }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900, letterSpacing: -0.4 }}>Reports & Analytics</h1>
        <button aria-label="Notifications" style={{ position: 'relative', border: 0, background: 'transparent', color: '#16334f', cursor: 'pointer' }}>
          <Icons.Bell />
          <span style={{ position: 'absolute', right: 1, top: 1, width: 7, height: 7, background: '#dc2626', borderRadius: '50%' }} />
        </button>
      </div>

      <section style={card({ padding: 24, marginBottom: 22 })}>
        <h2 style={{ margin: '0 0 18px', fontSize: 19, fontWeight: 900 }}>Generate Report</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: 14, alignItems: 'end' }}>
          <Field label="Report Type">
            <select style={selectStyle}><option>Attendance Summary</option><option>Payroll Breakdown</option><option>Leave Report</option></select>
          </Field>
          <Field label="Date Range">
            <select style={selectStyle}><option>This Month</option><option>Last Month</option><option>This Quarter</option></select>
          </Field>
          <Field label="Department">
            <select style={selectStyle}><option>All Departments</option><option>Engineering</option><option>Sales</option><option>Marketing</option><option>Human Resources</option></select>
          </Field>
          <button style={outlineBtn}><Icons.Download /> CSV</button>
          <button style={solidBtn}><Icons.File /> PDF</button>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.96fr', gap: 22, marginBottom: 22 }}>
        <section style={card({ padding: '24px 24px 16px' })}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 10 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Attendance Trend</h2>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: '#334c68' }}>Daily attendance rate for current month</p>
            </div>
            <span style={{ background: '#eef5ff', color: '#00796b', borderRadius: 999, padding: '6px 10px', fontSize: 11, fontWeight: 800 }}>This Month</span>
          </div>
          <AttendanceChart />
        </section>

        <section style={card({ padding: 24 })}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Leave Distribution</h2>
          <p style={{ margin: '4px 0 34px', fontSize: 13, color: '#334c68' }}>Breakdown of leaves taken</p>
          <LeaveDonut />
        </section>
      </div>

      <section style={card({ padding: 24 })}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 22 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Payroll Cost Breakdown</h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#334c68' }}>Monthly expense by department</p>
          </div>
          <button aria-label="More options" style={{ border: 0, background: 'transparent', color: '#00796b', cursor: 'pointer' }}><Icons.More /></button>
        </div>
        <div style={{ display: 'grid', gap: 18 }}>
          {payrollRows.map(([department, amount, width, color]) => (
            <div key={department}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 13, color: '#06192f' }}>
                <span>{department}</span>
                <span>${amount.toLocaleString()}</span>
              </div>
              <div style={{ height: 8, borderRadius: 999, background: '#e1e7f2', overflow: 'hidden' }}>
                <div style={{ width: `${width}%`, height: '100%', background: color, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'grid', gap: 7, color: '#06192f', fontSize: 12, fontWeight: 800 }}>
      {label}
      {children}
    </label>
  );
}

function card(extra = {}) {
  return {
    background: '#fff',
    border: '1px solid #cfd7e3',
    borderRadius: 12,
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.05)',
    ...extra,
  };
}

const selectStyle = {
  height: 37,
  border: '1px solid #c7d0dc',
  borderRadius: 7,
  padding: '0 13px',
  background: '#f9fbff',
  color: '#06192f',
  fontSize: 13,
  outline: 'none',
};

const outlineBtn = {
  height: 37,
  minWidth: 96,
  border: '1px solid #c7d0dc',
  borderRadius: 7,
  background: '#fff',
  color: '#06192f',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  fontSize: 13,
  fontWeight: 800,
  cursor: 'pointer',
};

const solidBtn = {
  ...outlineBtn,
  border: 0,
  background: '#00796b',
  color: '#fff',
};
