import './LeaveRequests.css';

const balances = [
  ['Casual', '7', '12', '38%'], ['Sick', '7', '10', '30%'], ['Earned', '8', '15', '47%'],
];

export default function LeaveRequests() {
  return <main className="leave-page">
    <aside className="leave-side"><div className="leave-logo"><b>C</b><div><strong>CorporateHR</strong><small>Management Suite</small></div></div><a href="/employee">▦ &nbsp; Dashboard</a><a href="#attendance">▦ &nbsp; Attendance</a><a className="active" href="/employee/leave">▣ &nbsp; Leave</a><a href="#payroll">▣ &nbsp; Payroll</a><a href="#profile">♙ &nbsp; Profile</a></aside>
    <section className="leave-main"><header className="leave-top"><button className="mobile-menu">☰</button><h2>Leave Management</h2><span>▣ &nbsp; Saturday, 22 Aug 2026</span><input placeholder="⌕  Search..." /><span>♧</span><span className="leave-user">Vishnu<br/><small>EMP001</small></span><span className="avatar mini-avatar">VK</span></header>
      <div className="leave-content"><div className="leave-heading"><div><h1>Good morning, Vishnu 👋</h1><p>Manage your leave requests and balance</p></div><button className="blue-button">＋ &nbsp; Apply for Leave</button></div>
        <div className="leave-summary">{balances.map(([type, count, total, width]) => <section className={`leave-card ${type.toLowerCase()}`} key={type}><h3>{type}</h3><div className="balance">{count} <span>/ {total} remaining</span></div><div className="progress"><i style={{width}} /></div><span className="used">{type === 'Earned' ? '7 used' : type === 'Sick' ? '3 used' : '5 used'}</span></section>)}<section className="leave-card"><h3>Summary</h3><div className="summary-list"><span>Pending Requests <b>2</b></span><span>Approved This Month <b>1</b></span><span>Rejected <b>1</b></span><hr/><span>Total Remaining <strong>22</strong></span></div></section></div>
        <div className="leave-body"><section className="history"><div className="history-head"><h2>Leave History</h2><input placeholder="⌕  Search..."/><select><option>All Types</option></select></div><table><thead><tr><th>DATE APPLIED</th><th>LEAVE TYPE & DATES</th><th>DURATION</th><th>STATUS</th><th>ACTION</th></tr></thead><tbody><tr><td>15 Aug 2026</td><td>Casual<br/>18 Aug - 19 Aug</td><td>2 days</td><td><span className="pill pending">Pending</span><br/><small>♙ Priya S.</small></td><td><button className="cancel">Cancel</button></td></tr><tr><td>02 Aug 2026</td><td>Sick<br/>05 Aug</td><td>1 day</td><td><span className="pill approved">Approved</span></td><td><a href="#view">View</a></td></tr></tbody></table><a className="all-requests" href="#all">View All Requests</a></section>
          <aside className="request-card"><h2>Request Details <span className="pill pending">Pending</span></h2><h3>▣ &nbsp; LEAVE TYPE & DATES</h3><p><b>Casual Leave</b><br/>18 Aug 2026 - 19 Aug 2026 (2 days)</p><h3>▣ &nbsp; REASON</h3><p className="reason">“Family event out of town.”</p><div className="approver"><h3>APPROVAL FLOW</h3><p><b>Priya Sharma</b>Manager</p></div><button className="cancel">Cancel Request</button></aside></div>
      </div></section>
  </main>;
}
