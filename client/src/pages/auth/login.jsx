import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import './auth.css';

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">DF</span>
      <span>Dayflow</span>
    </div>
  );
}

function PasswordField({ id, label = 'Password', value, onChange }) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      <span className="input-wrap">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          placeholder="Enter your password"
          required
          value={value}
          onChange={onChange}
          autoComplete="current-password"
        />
        <button
          type="button"
          className="icon-button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </span>
    </label>
  );
}

function WorkspaceArtwork() {
  return (
    <div className="work-art" aria-hidden="true">
      <div className="work-window">
        <span />
        <span />
        <span />
      </div>
      <div className="work-table" />
      <div className="person person-one" />
      <div className="person person-two" />
      <div className="person person-three" />
      <div className="plant" />
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, getHomeRoute, friendlyAuthError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (location.state?.message) {
      setStatus({ type: 'success', message: location.state.message });
    }
  }, [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: '', message: '' });
    setIsSubmitting(true);

    try {
      const result = await login({
        email: email.trim().toLowerCase(),
        password,
      });

      navigate(getHomeRoute(result.profile.role), { replace: true });
    } catch (error) {
      setStatus({
        type: 'error',
        message: friendlyAuthError(error),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page login-page">
      <section className="login-showcase">
        <Brand />
        <div className="showcase-copy">
          <h1>Operational Harmony</h1>
          <p>Every workday, perfectly aligned. Streamline your HR processes with confidence.</p>
        </div>
        <WorkspaceArtwork />
      </section>

      <section className="login-panel">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Welcome back</h2>
          <p>Please enter your details to sign in.</p>

          <label className="field" htmlFor="login-email">
            <span>Email</span>
            <input
              id="login-email"
              type="email"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </label>

          <div className="password-label">
            <span>Password</span>
            <a href="#forgot">Forgot Password?</a>
          </div>

          <PasswordField
            id="login-password"
            label=""
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="primary-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing In...' : <>Sign In <b>→</b></>}
          </button>

          {status.message ? <p className={`form-status ${status.type}`}>{status.message}</p> : null}
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </section>
    </main>
  );
}

