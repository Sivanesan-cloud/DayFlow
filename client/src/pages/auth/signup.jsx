import { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

function Brand() { return <div className="brand"><span className="brand-mark">✣</span><span>Dayflow</span></div>; }

function PasswordInput({ id, label }) {
  const [visible, setVisible] = useState(false);
  return <label className="field" htmlFor={id}>
    <span>{label}</span>
    <span className="input-wrap"><input id={id} type={visible ? 'text' : 'password'} placeholder="••••••••" required /><button type="button" className="icon-button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? '◉' : '◌'}</button></span>
  </label>;
}

export default function Signup() {
  const [role, setRole] = useState('employee');
  return <main className="auth-page signup-page">
    <section className="signup-showcase">
      <Brand /><span className="hrms-label">HRMS</span>
      <div className="dayflow-wordmark"><span>◒</span><strong>Dayflow</strong><small>HRMS</small></div>
      <div className="signup-copy"><h2>Operational Harmony.</h2><p>Streamline your workforce management with frictionless tools designed for modern teams.</p></div>
    </section>
    <section className="signup-panel">
      <form className="signup-form" onSubmit={(event) => event.preventDefault()}>
        <h1>Create your account</h1><p>Join your team on Dayflow.</p>
        <fieldset className="role-select"><legend>I am an</legend><div><button type="button" className={role === 'employee' ? 'active' : ''} onClick={() => setRole('employee')}>♙ &nbsp; Employee</button><button type="button" className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>♧ &nbsp; HR / Admin</button></div></fieldset>
        <label className="field" htmlFor="employee-id"><span>Employee ID</span><input id="employee-id" placeholder="▣ e.g. DF-1042" required /></label>
        <label className="field" htmlFor="full-name"><span>Full Name</span><input id="full-name" placeholder="◉ Jane Doe" required /></label>
        <label className="field" htmlFor="work-email"><span>Work Email</span><input id="work-email" type="email" placeholder="✉ jane.doe@company.com" required /><small>ⓘ Email verification required.</small></label>
        <PasswordInput id="new-password" label="Password" />
        <div className="password-rules"><span>× Uppercase</span><span>× Number</span><span>× Special Char</span></div>
        <PasswordInput id="confirm-password" label="Confirm Password" />
        <label className="terms"><input type="checkbox" required /> <span>I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.</span></label>
        <button type="submit" className="primary-button">Create Account <b>→</b></button>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
      </form>
    </section>
  </main>;
}
