import { useState } from 'react';

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 38, bg = '#0d9488' }) => {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', background: bg, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: size * 0.36, fontWeight: 700, letterSpacing: 0.5,
    }}>{initials}</div>
  );
};

// ─── Dummy Data ───────────────────────────────────────────────────────────────
const currentEmployees = [
  { id: 'EMP-1024', name: 'Sarah Jenkins', dept: 'Engineering', designation: 'Senior Dev',   salary: '₹1,25,000', status: 'Paid',    bg: '#94a3b8' },
  { id: 'EMP-1025', name: 'Michael Ross',  dept: 'Design',      designation: 'UX Designer',  salary: '₹95,000',   status: 'Pending', bg: '#0d9488' },
  { id: 'EMP-1026', name: 'Elena Wright',  dept: 'Marketing',   designation: 'SEO Analyst',  salary: '₹72,000',   status: 'Paid',    bg: '#7c3aed' },
  { id: 'EMP-1027', name: 'David Kim',     dept: 'Engineering', designation: 'DevOps',       salary: '₹1,10,000', status: 'Paid',    bg: '#0369a1' },
];
const exEmployees = [
  { id: 'EMP-0901', name: 'James Carter',  dept: 'Finance',     designation: 'Accountant',   salary: '₹88,000',   status: 'Paid',    bg: '#be185d' },
  { id: 'EMP-0912', name: 'Priya Kapoor',  dept: 'HR',          designation: 'HR Manager',   salary: '₹1,02,000', status: 'Paid',    bg: '#ea580c' },
];

// ─── Yearly trend data (Jan–May) ──────────────────────────────────────────────
const trendPoints = [
  { label: 'Jan', val: 28.0 },
  { label: 'Feb', val: 29.8 },
  { label: 'Mar', val: 28.7 },
  { label: 'Apr', val: 30.6 },
  { label: 'May', val: 32.4 },
];

// ─── Donut segments: Basic 50%, Allowances 30%, Bonuses 10%, Deductions 10% ──
const donutSegments = [
  { label: 'Basic',       pct: 50, color: '#0d7a6a' },
  { label: 'Allowances',  pct: 30, color: '#5eead4' },
  { label: 'Bonuses',     pct: 10, color: '#bae6fd' },
  { label: 'Deductions',  pct: 10, color: '#dc2626' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function polarToXY(cx, cy, r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function donutPath(cx, cy, R, r, startDeg, endDeg) {
  const s = polarToXY(cx, cy, R, startDeg);
  const e = polarToXY(cx, cy, R, endDeg);
  const si = polarToXY(cx, cy, r, startDeg);
  const ei = polarToXY(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${s.x} ${s.y}`,
    `A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`,
    `L ${ei.x} ${ei.y}`,
    `A ${r} ${r} 0 ${large} 0 ${si.x} ${si.y}`,
    'Z',
  ].join(' ');
}

// ─── SVG Line Chart ───────────────────────────────────────────────────────────
function LineChart() {
  const W = 860, H = 180, padL = 48, padB = 30, padT = 16, padR = 20;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const minV = 27.5, maxV = 33;
  const toX = i => padL + (i / (trendPoints.length - 1)) * chartW;
  const toY = v => padT + chartH - ((v - minV) / (maxV - minV)) * chartH;
  const pts = trendPoints.map((d, i) => ({ x: toX(i), y: toY(d.val), ...d }));
  // smooth bezier path
  const path = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return acc + ` C ${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
  }, '');
  // area fill path (close to bottom)
  const area = path + ` L ${pts[pts.length-1].x},${padT+chartH} L ${pts[0].x},${padT+chartH} Z`;
  const yTicks = [28, 28.5, 29, 29.5, 30, 30.5, 31, 31.5, 32, 32.5];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0d9488" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      {/* Y-axis grid lines */}
      {yTicks.map(t => {
        const y = toY(t);
        return y >= padT && y <= padT + chartH ? (
          <g key={t}>
            <line x1={padL} y1={y} x2={W - padR} y2={y} stroke="#e2e8f0" strokeWidth="0.8" />
            <text x={padL - 6} y={y + 4} fontSize="9" fill="#94a3b8" textAnchor="end">{t.toFixed(1)}</text>
          </g>
        ) : null;
      })}
      {/* Area fill */}
      <path d={area} fill="url(#areaGrad)" />
      {/* Line */}
      <path d={path} fill="none" stroke="#0d9488" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Data points */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#0d9488" strokeWidth="2" />
      ))}
      {/* X-axis labels */}
      {pts.map((p, i) => (
        <text key={i} x={p.x} y={H - 6} fontSize="10" fill="#94a3b8" textAnchor="middle">{p.label}</text>
      ))}
    </svg>
  );
}

// ─── SVG Donut Chart ──────────────────────────────────────────────────────────
function DonutChart() {
  const cx = 130, cy = 110, R = 90, r = 56;
  let start = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
      <svg width="260" height="220" viewBox="0 0 260 220">
        {donutSegments.map((seg, i) => {
          const sweep = (seg.pct / 100) * 360;
          const end = start + sweep;
          const d = donutPath(cx, cy, R, r, start, end);
          start = end;
          return <path key={i} d={d} fill={seg.color} />;
        })}
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {donutSegments.map(seg => (
          <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#334155' }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
            {seg.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const PayBadge = ({ status }) => {
  const isPaid = status === 'Paid';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: isPaid ? '#f0fdf4' : '#fff7ed',
      color: isPaid ? '#16a34a' : '#d97706',
      border: `1px solid ${isPaid ? '#bbf7d0' : '#fde68a'}`,
      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: isPaid ? '#16a34a' : '#f59e0b' }} />
      {status}
    </div>
  );
};

// ─── ChevronLeft / ChevronRight ───────────────────────────────────────────────
const ChevLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
);
const ChevRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Payroll() {
  const [tab, setTab] = useState('current');
  const [search, setSearch] = useState('');

  const employees = tab === 'current' ? currentEmployees : exEmployees;
  const filtered = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", width: '100%', animation: 'fadeIn 0.3s ease' }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: '#1e293b', letterSpacing: -0.5 }}>
          Payroll Management
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#64748b' }}>
          Manage employee salary and payroll information
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>

        {/* Total Employees */}
        <div style={card}>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>Total Employees</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#1e293b', marginBottom: 6 }}>120</div>
            <div style={{ display: 'flex', gap: 12, fontSize: 12, fontWeight: 600 }}>
              <span style={{ color: '#0d9488' }}>⊙ 98 Active</span>
              <span style={{ color: '#94a3b8' }}>⊙ 22 Ex</span>
            </div>
          </div>
          <div style={iconBox('#f0fdfb')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
        </div>

        {/* Total Payroll */}
        <div style={card}>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>Total Payroll (This Month)</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#1e293b', marginBottom: 6 }}>₹32.5 L</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>▲ 8.5% vs last month</div>
          </div>
          <div style={iconBox('#f0fdfb')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.8">
              <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
            </svg>
          </div>
        </div>

        {/* Pending Payrolls */}
        <div style={card}>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginBottom: 8 }}>Pending Payrolls</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#1e293b', marginBottom: 6 }}>12</div>
            <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>Requires approval</div>
          </div>
          <div style={iconBox('#fff7ed')}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── Analytics Overview ── */}
      <div style={{ fontSize: 18, fontWeight: 800, color: '#1e293b', marginBottom: 14 }}>Analytics Overview</div>

      {/* Line Chart */}
      <div style={{ ...card, marginBottom: 20, padding: '20px 20px 12px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 10 }}>Yearly Payroll Trend</div>
        <LineChart />
      </div>

      {/* Donut Chart */}
      <div style={{ ...card, marginBottom: 28, padding: '20px 24px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 14 }}>Salary Distribution</div>
        <DonutChart />
      </div>

      {/* ── Employee Table ── */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0' }}>
          {[['current', 'Current Employees'], ['ex', 'Previous (Ex) Employees']].map(([key, label]) => {
            const active = tab === key;
            return (
              <button key={key} onClick={() => { setTab(key); setSearch(''); }} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '14px 22px', fontSize: 13.5, fontWeight: active ? 700 : 500,
                color: active ? '#0d9488' : '#64748b',
                borderBottom: `2.5px solid ${active ? '#0d9488' : 'transparent'}`,
                transition: 'all 0.15s',
              }}>{label}</button>
            );
          })}
        </div>

        {/* Search + Filters */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 14px', background: '#fff',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search employee..."
              style={{ border: 'none', outline: 'none', fontSize: 13.5, color: '#334155', width: '100%', background: 'transparent' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <select style={filterSelect}>
              <option>May 2026</option>
              <option>April 2026</option>
              <option>March 2026</option>
            </select>
            <select style={filterSelect}>
              <option>All Depts</option>
              <option>Engineering</option>
              <option>Design</option>
              <option>Marketing</option>
            </select>
            <button style={{
              padding: '7px 14px', borderRadius: 8, border: '1px solid #e2e8f0',
              background: '#f8fafc', fontSize: 13, color: '#64748b', cursor: 'pointer', fontWeight: 500
            }}>Clear</button>
          </div>
        </div>

        {/* Rows */}
        <div>
          {filtered.map((emp, i) => (
            <div key={emp.id} style={{
              padding: '18px 20px',
              borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none',
              display: 'grid',
              gridTemplateColumns: 'minmax(260px, 2fr) minmax(150px, 1fr) auto',
              alignItems: 'center',
              gap: 24,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <Avatar name={emp.name} bg={emp.bg} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', lineHeight: 1.4 }}>{emp.name}</div>
                  <div style={{ fontSize: 12, color: '#0d9488', marginTop: 2 }}>
                    {emp.id} • {emp.dept}
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>Designation</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{emp.designation}</div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>Net Salary</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{emp.salary}</div>
              </div>
              <div style={{ justifySelf: 'end' }}>
                <PayBadge status={emp.status} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 20px', borderTop: '1px solid #f1f5f9',
          fontSize: 12, color: '#64748b',
        }}>
          <span>1-{filtered.length} of {employees.length === currentEmployees.length ? 98 : 12}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            {[ChevLeft, ChevRight].map((Icon, i) => (
              <button key={i} style={{
                width: 28, height: 28, borderRadius: 6, border: '1px solid #e2e8f0',
                background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><Icon /></button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        input::placeholder { color: #94a3b8; }
      `}</style>
    </div>
  );
}

// ─── Style helpers ────────────────────────────────────────────────────────────
const card = {
  background: '#fff', borderRadius: 14, padding: 20,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #e8edf2',
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
};
function iconBox(bg) {
  return {
    width: 44, height: 44, borderRadius: 10, background: bg,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  };
}
const filterSelect = {
  padding: '7px 12px', borderRadius: 8, border: '1px solid #e2e8f0',
  background: '#fff', fontSize: 13, color: '#334155', cursor: 'pointer', outline: 'none',
};

