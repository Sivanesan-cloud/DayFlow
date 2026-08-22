import './DashboardRef.css';
import './DashboardLayout.css';

const activities = [
  ['✓', 'green', 'Your leave request for Aug 18–19 was approved', '2 hours ago'],
  ['i', 'blue', 'Attendance marked for today', 'Today at 09:15 AM'],
  ['✓', 'green', 'Salary for August 2026 has been processed', 'Yesterday'],
  ['▣', 'gray', 'Profile photo updated successfully', 'Aug 15, 2026'],
];

export default function Dashboard() {
  return <main className="corporate-dashboard">
    <aside className="corp-sidebar"><div className="corp-logo"><b>C</b><div><strong>CorporateHR</strong><small>Management Suite</small></div></div><nav><a className="selected" href="/employee">▦ <span>Dashboard</span></a><a href="#attendance">▦ <span>Attendance</span></a><a href="/employee/leave">▣ <span>Leave</span></a><a href="/employee/salary">▣ <span>Payroll</span></a><a href="#profile">♙ <span>Profile</span></a></nav></aside>
    <section className="corp-main"><header className="corp-top"><span>Saturday, 22 August 2026</span><label>⌕ <input placeholder="Search..." /></label><div><button>♧</button><button>▣</button><span><b>Vishnu</b><small>EMP001</small></span><i>VK</i></div></header><div className="corp-content"><header className="corp-greeting"><h1>Good morning, Vishnu <span>👋</span></h1><p>Every workday, perfectly aligned.</p></header><section className="corp-overview"><article className="employee-card"><div className="portrait">VK</div><h2>Vishnu</h2><p>Software Engineer</p><a href="#profile">View Profile</a></article><article className="overview-card"><header><i className="mint">♧</i><span>Present</span></header><h2>Attendance</h2><p>Checked in at 09:15 AM</p><button>Check Out</button></article><article className="overview-card"><header><i className="peach">▣</i><span className="pending">2 Pending</span></header><h2>Leave Balance</h2><p>7 Casual Leave remaining</p><button className="leave-button">Apply for Leave</button></article><article className="overview-card salary-card"><header><i className="sky">▤</i></header><p>August 2026 Processed</p><h2>₹68,450 <small>Net</small></h2><a href="/employee/salary">View Salary →</a></article></section><section className="corp-activity"><h2>Recent Activity</h2><div>{activities.map(([icon, type, title, time]) => <article key={title}><i className={type}>{icon}</i><p>{title}<small>{time}</small></p></article>)}</div></section></div></section>
  </main>;
}
