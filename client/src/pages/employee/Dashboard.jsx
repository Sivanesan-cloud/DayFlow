import './employee-dashboard.css';

const navItems = [['▦', 'Dashboard'], ['◷', 'Attendance'], ['□', 'Leave'], ['▣', 'Payroll'], ['▤', 'Documents']];

export default function Dashboard() {
  return <main className="employee-portal">
    <aside className="employee-sidebar"><div className="portal-brand"><strong>Dayflow</strong><small>HR Portal</small></div><nav>{navItems.map(([icon, label], index) => <button className={index === 0 ? 'selected' : ''} key={label}><span>{icon}</span>{label}</button>)}</nav><button className="logout"><span>⇥</span> Log Out</button></aside>
    <section className="portal-content">
      <header className="portal-header"><button className="menu-toggle">☰</button><div><button>♧</button><button>⚙</button><button>?</button><span className="avatar mini-avatar">SJ</span></div></header>
      <section className="employee-profile card"><span className="avatar">SJ</span><div className="profile-name"><h1>Sarah Jenkins</h1><p>Senior Product Designer • Design Team</p></div><div className="profile-meta"><span>Employee ID<b>DF-10492</b></span><span>Manager<b>David Chen</b></span></div></section>
      <div className="dashboard-grid">
        <section className="attendance card"><div className="card-heading"><div><h2>◷ Today's Attendance</h2><p>Oct 24, 2023</p></div><button className="checkin">◉ &nbsp; Check In</button></div><div className="attendance-bar"><i/><i/><i/><i/><i/></div></section>
        <section className="payout card"><h2>▣ Last Payout</h2><p>September 2023</p><strong>$5,420<sup>.00</sup></strong><a href="#payout-history">View Payslip History</a></section>
        <section className="leave-card card"><div className="card-heading"><h2>Leave Balances</h2><button className="apply">Apply</button></div><div className="leave-row"><div><b>Annual Leave</b><span>Available</span></div><em>12 Days</em></div><div className="leave-row"><div><b>Sick Leave</b><span>Available</span></div><em className="low">4 Days</em></div></section>
        <section className="activity card"><h2>Activity</h2><div className="timeline"><div><span>◉</span><p>Performance Review Signed<small>2 hours ago</small></p></div><div><span>⌁</span><p>Leave Request Approved<small>Yesterday, 4:30 PM</small></p></div></div></section>
        <section className="quick-docs card"><h2>Quick Docs</h2><div><button>♙<small>Company<br />Policy</small></button><button>♢<small>Benefits<br />Guide</small></button><button>▧<small>Tax<br />Form (W4)</small></button><button>•••<small>View<br />All</small></button></div></section>
      </div>
    </section>
  </main>;
}
