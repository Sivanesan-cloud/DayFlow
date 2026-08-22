import { useState } from 'react';
import { Link } from 'react-router-dom';
import './auth.css';

function Brand() {
  return <div className="brand"><span className="brand-mark">✣</span><span>Dayflow</span></div>;
}

function PasswordField({ id, label = 'Password' }) {
  const [visible, setVisible] = useState(false);
  return <label className="field" htmlFor={id}>
    <span>{label}</span>
    <span className="input-wrap">
      <input id={id} type={visible ? 'text' : 'password'} placeholder="••••••••" required />
      <button type="button" className="icon-button" onClick={() => setVisible(!visible)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? '◉' : '◌'}</button>
    </span>
  </label>;
}

function WorkspaceArtwork() {
  return <div className="work-art" aria-hidden="true">
    <div className="work-window"><span /><span /><span /></div>
    <div className="work-table" />
    <div className="person person-one" /><div className="person person-two" /><div className="person person-three" /><div className="plant" />
  </div>;
}

export default function Login() {
  return <main className="auth-page login-page">
    <section className="login-showcase">
      <Brand />
      <div className="showcase-copy">
        <h1>Operational Harmony</h1>
        <p>Every workday, perfectly aligned. Streamline your HR processes with confidence.</p>
      </div>
      <WorkspaceArtwork />
    </section>
    <section className="login-panel">
      <form className="login-card" onSubmit={(event) => event.preventDefault()}>
        <h2>Welcome back</h2>
        <p>Please enter your details to sign in.</p>
        <label className="field" htmlFor="login-email"><span>Email</span><input id="login-email" type="email" placeholder="name@company.com" required /></label>
        <div className="password-label"><span>Password</span><a href="#forgot">Forgot Password?</a></div>
        <PasswordField id="login-password" label="" />
        <button className="primary-button" type="submit">Sign In <b>→</b></button>
      </form>
      <p className="auth-switch">Don't have an account? <Link to="/signup">Sign Up</Link></p>
    </section>
  </main>;
}
