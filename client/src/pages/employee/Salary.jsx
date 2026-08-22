import { useState } from 'react';
import './Salary.css';

const earnings = [['Basic', '₹40,000'], ['HRA', '₹16,000'], ['Special Allowance', '₹12,000'], ['Conveyance', '₹5,000'], ['Medical', '₹5,000']];
const deductions = [['PF', '₹4,800'], ['Professional Tax', '₹200'], ['TDS', '₹4,000'], ['Other', '₹550']];

function DetailModal({ close }) {
  return <div className="salary-modal-backdrop" onClick={close}><section className="salary-modal" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={close}>×</button><small>DAYFLOW · AUGUST 2026 PAYSLIP</small><h2>Salary details</h2><p>Vishnu · EMP001 · Engineering</p><div><b>Net Pay</b><strong>₹68,450</strong></div><button className="download-modal" onClick={() => window.print()}>⇩ Download / Print Payslip</button></section></div>;
}

export default function Salary() {
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState('');
  const notify = text => { setMessage(text); setTimeout(() => setMessage(''), 2400); };
  return <main className="salary-ref-page">
    <aside className="ref-sidebar"><div className="ref-brand"><b>▦</b><div><strong>Dayflow</strong><small>HR Management</small></div></div><nav><a href="/employee">▦ <span>Dashboard</span></a><a href="/employee/leave">▣ <span>Leave</span></a><a href="#attendance">◴ <span>Attendance</span></a><a className="active" href="/employee/salary">▣ <span>Salary</span></a><a href="#profile">♙ <span>Profile</span></a></nav><div className="ref-bottom"><button>⚙ <span>Settings</span></button><button>⇥ <span>Logout</span></button></div></aside>
    <section className="ref-main"><header className="ref-topbar"><label>⌕ <input placeholder="Search..." /></label><div><span>October 24, 2023</span><button>♧</button><button>?</button><button className="check-in">Check In</button><b className="small-avatar">V</b></div></header><div className="ref-content"><header className="ref-heading"><h1>Good morning, Vishnu <span>👋</span></h1><p>View and confirm your salary details</p></header>{message && <div className="ref-toast">✓ {message}</div>}
      <section className="salary-hero"><article className="month-salary"><header><div><small>THIS MONTH'S SALARY</small><h2>August 2026</h2></div><span className="processed">◉ Processed</span></header><div className="net-salary"><div><small>Net Pay</small><b>₹68,450</b></div><div><small>Gross Salary</small><b>₹78,000</b></div><div><small>Total Deductions</small><b>₹9,550</b></div></div><footer><span>Salary Date: 31 August 2026</span><button onClick={() => setModal(true)}>▣ &nbsp; Download Payslip</button></footer></article><article className="confirm-card"><span>Pending Acknowledgment</span><h2>CONFIRM YOUR SALARY</h2><p>Please review your salary for<br />August 2026 and confirm.</p><button className="accept" onClick={() => notify('Salary acknowledgement submitted.')}>✓ &nbsp; Accept</button><button className="report" onClick={() => notify('Your salary issue report has been started.')}>⚑ &nbsp; Report an Issue</button></article></section>
      <section className="salary-tables"><article><h3>EARNINGS</h3>{earnings.map(([name, amount]) => <div className="line" key={name}><span>{name}</span><b>{amount}</b></div>)}<footer><span>Gross Earnings</span><b>₹78,000</b></footer></article><article><h3>DEDUCTIONS</h3>{deductions.map(([name, amount]) => <div className="line" key={name}><span>{name}</span><b>{amount}</b></div>)}<footer><span>Total Deductions</span><b>₹9,550</b></footer></article></section>
      <section className="tax-summary"><i>▤</i><div><small>TAX DETAILS</small><p>Tax Regime: <b>New Regime</b><br />TDS Deducted (This FY): <b>₹18,400</b></p></div><button onClick={() => notify('Form 16 download is being prepared.')}>⇩ &nbsp; Download Form 16</button></section>
    </div></section>{modal && <DetailModal close={() => setModal(false)} />}
  </main>;
}
