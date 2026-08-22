import { useMemo, useState } from 'react';

const departments = ['All Employees', 'Engineering', 'HR', 'Sales', 'Marketing', 'Design'];

const starterEmployees = [
  { id: 'EMP-001', name: 'Jane Cooper', role: 'Lead Engineer', department: 'Engineering', status: 'Active', mode: 'Remote', bg: '#0d9488' },
  { id: 'EMP-014', name: 'Wade Warren', role: 'Product Manager', department: 'Design', status: 'Active', mode: 'Office', bg: '#0369a1' },
  { id: 'EMP-042', name: 'Esther Howard', role: 'Marketing Director', department: 'Marketing', status: 'On Leave', mode: 'Office', bg: '#d97706' },
  { id: 'EMP-088', name: 'Cameron Williamson', role: 'HR Specialist', department: 'HR', status: 'Active', mode: 'Hybrid', bg: '#0f766e' },
  { id: 'EMP-102', name: 'Brooklyn Simmons', role: 'Sales Exec', department: 'Sales', status: 'Active', mode: 'Remote', bg: '#0d9488' },
  { id: 'EMP-111', name: 'Arlene McCoy', role: 'Frontend Engineer', department: 'Engineering', status: 'Active', mode: 'Hybrid', bg: '#7c3aed' },
  { id: 'EMP-126', name: 'Leslie Alexander', role: 'Brand Designer', department: 'Design', status: 'Active', mode: 'Remote', bg: '#be185d' },
  { id: 'EMP-139', name: 'Ronald Richards', role: 'Sales Manager', department: 'Sales', status: 'Active', mode: 'Office', bg: '#ea580c' },
  { id: 'EMP-154', name: 'Savannah Nguyen', role: 'HR Executive', department: 'HR', status: 'Active', mode: 'Office', bg: '#2563eb' },
  { id: 'EMP-177', name: 'Marvin McKinney', role: 'SEO Specialist', department: 'Marketing', status: 'Active', mode: 'Hybrid', bg: '#0891b2' },
];

const emptyForm = {
  name: '',
  role: '',
  department: 'Engineering',
  status: 'Active',
  mode: 'Office',
};

const Icons = {
  Search: () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  Plus: () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const Avatar = ({ employee }) => {
  const initials = employee.name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ position: 'relative', width: 78, height: 78, margin: '0 auto 12px' }}>
      <div style={{
        width: 78,
        height: 78,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        color: '#fff',
        fontSize: 24,
        fontWeight: 800,
        background: `linear-gradient(135deg, ${employee.bg}, #dbeafe)`,
        border: '4px solid #fff',
        boxShadow: '0 0 0 1px #d8dee8, 0 7px 18px rgba(15, 23, 42, 0.13)',
      }}>
        {initials}
      </div>
      <span style={{
        position: 'absolute',
        right: 2,
        bottom: 8,
        width: 13,
        height: 13,
        borderRadius: '50%',
        background: employee.status === 'On Leave' ? '#f59e0b' : '#00796b',
        border: '3px solid #fff',
      }} />
    </div>
  );
};

const Badge = ({ children, type }) => {
  const palette = {
    status: { bg: '#e8f8ed', color: '#00803d' },
    leave: { bg: '#fff2d8', color: '#c56c00' },
    mode: { bg: '#e9f0fb', color: '#436080' },
  };
  const style = type === 'leave' ? palette.leave : type === 'mode' ? palette.mode : palette.status;

  return (
    <span style={{
      borderRadius: 999,
      padding: '4px 10px',
      background: style.bg,
      color: style.color,
      fontSize: 11,
      fontWeight: 700,
      lineHeight: 1,
    }}>
      {children}
    </span>
  );
};

export default function Employees() {
  const [employees, setEmployees] = useState(starterEmployees);
  const [activeDepartment, setActiveDepartment] = useState('All Employees');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const filteredEmployees = useMemo(() => {
    const text = search.trim().toLowerCase();
    return employees.filter(employee => {
      const matchesDepartment = activeDepartment === 'All Employees' || employee.department === activeDepartment;
      const matchesSearch = !text || [employee.name, employee.role, employee.department, employee.id]
        .some(value => value.toLowerCase().includes(text));
      return matchesDepartment && matchesSearch;
    });
  }, [activeDepartment, employees, search]);

  const saveEmployee = event => {
    event.preventDefault();
    const nextNumber = employees.length + 1;
    const newEmployee = {
      ...form,
      id: `EMP-${String(200 + nextNumber).padStart(3, '0')}`,
      bg: ['#0d9488', '#0369a1', '#7c3aed', '#be185d', '#ea580c'][nextNumber % 5],
    };
    setEmployees(prev => [newEmployee, ...prev]);
    setActiveDepartment(form.department);
    setSearch('');
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", color: '#06192f', animation: 'fadeIn 0.25s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, marginBottom: 22 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.1, fontWeight: 800, color: '#06192f' }}>Employees</h1>
          <p style={{ margin: '7px 0 0', color: '#233957', fontSize: 14 }}>Manage and view organizational directory.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{
            height: 38,
            width: 320,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 13px',
            borderRadius: 7,
            border: '1px solid #cbd5e1',
            background: '#fff',
            color: '#12324f',
          }}>
            <Icons.Search />
            <input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search employees..."
              style={{ border: 0, outline: 0, background: 'transparent', width: '100%', color: '#12324f', fontSize: 13 }}
            />
          </label>
          <button
            onClick={() => setShowForm(true)}
            style={{
              height: 38,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              border: 0,
              borderRadius: 7,
              padding: '0 18px',
              background: '#00796b',
              color: '#fff',
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <Icons.Plus /> Add Employee
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', marginBottom: 25 }}>
        {departments.map(department => {
          const active = department === activeDepartment;
          return (
            <button
              key={department}
              onClick={() => setActiveDepartment(department)}
              style={{
                border: `1px solid ${active ? '#00796b' : '#cbd5e1'}`,
                background: active ? '#e8fbf6' : '#fff',
                color: active ? '#00796b' : '#17253d',
                borderRadius: 999,
                padding: '7px 16px',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {department}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {filteredEmployees.map(employee => (
          <article key={employee.id} style={{
            minHeight: 204,
            background: '#fff',
            border: '1px solid #d4dce7',
            borderRadius: 10,
            padding: '20px 18px 17px',
            textAlign: 'center',
            boxShadow: '0 1px 2px rgba(15, 23, 42, 0.07)',
          }}>
            <Avatar employee={employee} />
            <h2 style={{ margin: 0, fontSize: 20, lineHeight: 1.2, color: '#06192f' }}>{employee.name}</h2>
            <div style={{ marginTop: 7, color: '#00796b', fontSize: 12, fontWeight: 800 }}>{employee.role}</div>
            <div style={{ marginTop: 4, color: '#06192f', fontSize: 11 }}>{employee.id} - {employee.department}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 15 }}>
              <Badge type={employee.status === 'On Leave' ? 'leave' : 'status'}>{employee.status}</Badge>
              <Badge type="mode">{employee.mode}</Badge>
            </div>
          </article>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div style={{
          marginTop: 20,
          border: '1px dashed #cbd5e1',
          borderRadius: 10,
          background: '#fff',
          padding: 36,
          textAlign: 'center',
          color: '#64748b',
          fontWeight: 700,
        }}>
          No employees found.
        </div>
      )}

      {showForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 30,
          display: 'grid',
          placeItems: 'center',
          background: 'rgba(15, 23, 42, 0.32)',
          padding: 20,
        }}>
          <form onSubmit={saveEmployee} style={{
            width: 'min(520px, 100%)',
            background: '#fff',
            borderRadius: 12,
            border: '1px solid #d9e1ec',
            boxShadow: '0 18px 40px rgba(15, 23, 42, 0.18)',
            padding: 22,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 18 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 20, color: '#06192f' }}>Add Employee</h2>
                <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Enter the employee details and save.</p>
              </div>
              <button type="button" onClick={() => setShowForm(false)} style={{ border: 0, background: 'transparent', color: '#64748b', cursor: 'pointer' }}>
                <Icons.Close />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Field label="Employee Name">
                <input required value={form.name} onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))} style={inputStyle} />
              </Field>
              <Field label="Role">
                <input required value={form.role} onChange={event => setForm(prev => ({ ...prev, role: event.target.value }))} style={inputStyle} />
              </Field>
              <Field label="Department">
                <select value={form.department} onChange={event => setForm(prev => ({ ...prev, department: event.target.value }))} style={inputStyle}>
                  {departments.slice(1).map(department => <option key={department}>{department}</option>)}
                </select>
              </Field>
              <Field label="Status">
                <select value={form.status} onChange={event => setForm(prev => ({ ...prev, status: event.target.value }))} style={inputStyle}>
                  <option>Active</option>
                  <option>On Leave</option>
                </select>
              </Field>
              <Field label="Work Mode">
                <select value={form.mode} onChange={event => setForm(prev => ({ ...prev, mode: event.target.value }))} style={inputStyle}>
                  <option>Office</option>
                  <option>Remote</option>
                  <option>Hybrid</option>
                </select>
              </Field>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
              <button type="button" onClick={() => setShowForm(false)} style={secondaryBtn}>Cancel</button>
              <button type="submit" style={primaryBtn}>Save Employee</button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: #62748c; }
        @media (max-width: 760px) {
          .employee-tools { width: 100%; }
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: 'grid', gap: 6, color: '#334155', fontSize: 12, fontWeight: 800 }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  height: 38,
  border: '1px solid #cbd5e1',
  borderRadius: 7,
  padding: '0 10px',
  outline: 'none',
  color: '#0f172a',
  background: '#fff',
  font: '13px Inter, system-ui, sans-serif',
};

const primaryBtn = {
  height: 38,
  border: 0,
  borderRadius: 7,
  padding: '0 16px',
  background: '#00796b',
  color: '#fff',
  fontSize: 13,
  fontWeight: 800,
  cursor: 'pointer',
};

const secondaryBtn = {
  height: 38,
  border: '1px solid #cbd5e1',
  borderRadius: 7,
  padding: '0 16px',
  background: '#fff',
  color: '#334155',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
};
