import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './auth.css';

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">✣</span>
      <span>Dayflow</span>
    </div>
  );
}

function PasswordInput({ id, label, value, onChange, autoComplete }) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <span className="input-wrap">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          placeholder="••••••••"
          required
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          className="icon-button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? '◉' : '◌'}
        </button>
      </span>
    </label>
  );
}

const passwordChecks = [
  {
    key: 'uppercase',
    label: 'Uppercase',
    test: (password) => /[A-Z]/.test(password),
  },
  {
    key: 'number',
    label: 'Number',
    test: (password) => /\d/.test(password),
  },
  {
    key: 'special',
    label: 'Special Char',
    test: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export default function Signup() {
  const navigate = useNavigate();
  const [role, setRole] = useState('employee');
  const [employeeId, setEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordState = passwordChecks.map((check) => ({
    ...check,
    passed: check.test(password),
  }));

  const isPasswordValid = passwordState.every((check) => check.passed);

  const handleSubmit = (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });

    if (!agreedToTerms) {
      setStatus({ type: 'error', message: 'Please agree to the Terms of Service and Privacy Policy.' });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' });
      return;
    }

    if (!isPasswordValid) {
      setStatus({ type: 'error', message: 'Password must include an uppercase letter, a number, and a special character.' });
      return;
    }

    setIsSubmitting(true);

    const account = {
      role,
      employeeId: employeeId.trim(),
      fullName: fullName.trim(),
      workEmail: workEmail.trim().toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    window.localStorage.setItem('dayflow.pendingAccount', JSON.stringify(account));
    const accounts = JSON.parse(window.localStorage.getItem('dayflow.accounts') || '[]');
    accounts.push(account);
    window.localStorage.setItem('dayflow.accounts', JSON.stringify(accounts));

    setIsSubmitting(false);
    navigate(role === 'admin' ? '/admin' : '/employee', { replace: true });
  };

  return (
    <main className="auth-page signup-page">
      <section className="signup-showcase">
        <Brand />
        <span className="hrms-label">HRMS</span>
        <div className="dayflow-wordmark">
          <span>◒</span>
          <strong>Dayflow</strong>
          <small>HRMS</small>
        </div>
        <div className="signup-copy">
          <h2>Operational Harmony.</h2>
          <p>Streamline your workforce management with frictionless tools designed for modern teams.</p>
        </div>
      </section>

      <section className="signup-panel">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h1>Create your account</h1>
          <p>Join your team on Dayflow.</p>

          <fieldset className="role-select">
            <legend>I am an</legend>
            <div>
              <button
                type="button"
                className={role === 'employee' ? 'active' : ''}
                onClick={() => setRole('employee')}
              >
                ♙ Employee
              </button>
              <button
                type="button"
                className={role === 'admin' ? 'active' : ''}
                onClick={() => setRole('admin')}
              >
                ♧ HR / Admin
              </button>
            </div>
          </fieldset>

          <label className="field" htmlFor="employee-id">
            <span>Employee ID</span>
            <input
              id="employee-id"
              name="employeeId"
              placeholder="e.g. DF-1042"
              required
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value)}
              autoComplete="off"
            />
          </label>

          <label className="field" htmlFor="full-name">
            <span>Full Name</span>
            <input
              id="full-name"
              name="fullName"
              placeholder="Jane Doe"
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              autoComplete="name"
            />
          </label>

          <label className="field" htmlFor="work-email">
            <span>Work Email</span>
            <input
              id="work-email"
              name="workEmail"
              type="email"
              placeholder="jane.doe@company.com"
              required
              value={workEmail}
              onChange={(event) => setWorkEmail(event.target.value)}
              autoComplete="email"
            />
            <small>ℹ Email verification required.</small>
          </label>

          <PasswordInput
            id="new-password"
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />

          <div className="password-rules" aria-live="polite">
            {passwordState.map((rule) => (
              <span key={rule.key}>{rule.passed ? '✓' : '✕'} {rule.label}</span>
            ))}
          </div>

          <PasswordInput
            id="confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
          />

          <label className="terms">
            <input
              type="checkbox"
              required
              checked={agreedToTerms}
              onChange={(event) => setAgreedToTerms(event.target.checked)}
            />
            <span>
              I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>.
            </span>
          </label>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : <>Create Account <b>→</b></>}
          </button>

          {status.message ? (
            <p className={`form-status ${status.type}`}>{status.message}</p>
          ) : null}

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
