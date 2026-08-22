import './Profile.css';

const NavItem = ({ href, icon, children, active }) => <a className={active ? 'active' : ''} href={href}><i>{icon}</i><span>{children}</span></a>;
const Field = ({ label, value }) => <label className="profile-field"><span>{label} <b>♧</b></span><input value={value} readOnly /></label>;

export default function Profile() {
  return <main className="profile-page">
    <aside className="profile-sidebar">
      <div className="profile-brand"><b>▦</b><div><strong>Dayflow</strong><small>HR Management</small></div></div>
      <nav><NavItem href="/employee" icon="▦">Dashboard</NavItem><NavItem href="/employee/leave" icon="▣">Leave</NavItem><NavItem href="#attendance" icon="▦">Attendance</NavItem><NavItem href="/employee/salary" icon="▤">Payroll</NavItem><NavItem href="/employee/profile" icon="♙" active>Profile</NavItem></nav>
      <div className="profile-sidebar-bottom"><a href="#request">Request Leave</a><button>⚙ <span>Settings</span></button><button className="logout">⇥ <span>Logout</span></button></div>
    </aside>
    <section className="profile-main">
      <header className="profile-topbar"><span></span><div><button aria-label="Notifications">♧</button><span className="profile-user"><b>Vishnu</b><small>EMP001</small></span><i className="top-avatar">VK</i></div></header>
      <div className="profile-content">
        <header className="profile-heading"><div><h1>My Profile</h1><p>Manage your personal and employment details.</p></div><button>✎ &nbsp; Edit Profile</button></header>
        <section className="profile-first-row">
          <article className="identity-card"><div className="profile-photo"><span>🕉</span></div><h2>Vishnu</h2><strong>Software Engineer</strong><p>Engineering • EMP001</p><hr /><div className="profile-stats"><span><b>12</b>Leaves Left</span><span><b>2</b>Years Tenure</span></div></article>
          <article className="profile-panel personal-panel"><h2>▣ &nbsp; Personal Details</h2><div className="profile-form"><Field label="Full Name" value="Vishnu" /><Field label="Date of Birth" value="14 Oct 1992" /><Field label="Email" value="vishnu.eng@dayflow.com" /><Field label="Phone" value="+91 9876543210" /><Field label="Address" value="123 Tech Park Avenue, Block C, Bangalore, India" /></div></article>
        </section>
        <section className="profile-second-row">
          <article className="profile-panel job-panel"><h2>▣ &nbsp; Job Details <small>♙ Read-only</small></h2><div className="job-grid"><p>Employee ID<b>EMP001</b></p><p>Department<b>Engineering</b></p><p>Role<b>Software Engineer</b></p><p>Joining Date<b>Jan 15, 2024</b></p><p>Manager<b>👤 Sarah Chen</b></p><p>Employment Type<b>Full-time</b></p></div></article>
          <article className="profile-panel salary-panel"><h2>▣ &nbsp; Salary Structure</h2><div className="salary-lines"><p><span>Basic</span><b>₹40,000</b></p><p><span>HRA</span><b>₹16,000</b></p><p><span>Special Allowance</span><b>₹12,000</b></p><p className="deduction"><span>Deductions</span><b>-₹9,550</b></p><p className="net-pay"><span>Net Pay</span><b>₹68,450</b></p></div><small className="salary-note">ⓘ &nbsp; Salary details are view-only. Contact HR for changes.</small></article>
        </section>
        <section className="profile-panel documents-panel"><h2>▧ &nbsp; Documents <button>↥ &nbsp; Upload Document</button></h2><div className="documents-empty">Your uploaded documents will appear here.</div></section>
      </div>
    </section>
  </main>;
}
