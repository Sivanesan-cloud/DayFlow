import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';
const DEV_AUTH_BYPASS = import.meta.env.VITE_DEV_AUTH_BYPASS === 'true';
const roleLabel = value => value === 'Admin' ? 'admin' : value === 'HR Officer' ? 'hr' : 'employee';
async function api(path, user, options = {}) { const token = await user.getIdToken(); const response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers || {}) } }); const body = await response.json().catch(() => ({})); if (!response.ok) throw Object.assign(new Error(body.error || 'Request failed'), { status: response.status }); return body; }
async function devLogin(email) { const response = await fetch(`${API_URL}/dev/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) }); const body = await response.json().catch(() => ({})); if (!response.ok) throw Object.assign(new Error(body.error || 'Development login failed'), { status: response.status }); return body; }
function makeProfile(employee, user) { return { uid: employee?.firebase_uid || user.uid, email: employee?.email || user.email || '', fullName: employee ? `${employee.first_name} ${employee.last_name}` : user.displayName || '', employeeId: employee?.employee_code || '', role: roleLabel(employee?.role_name), employee }; }
function friendlyAuthError(error) { const messages = { 'auth/email-already-in-use': 'That email address is already registered.', 'auth/invalid-email': 'Please enter a valid email address.', 'auth/weak-password': 'Please choose a stronger password.', 'auth/invalid-credential': 'Incorrect email or password.', 'auth/too-many-requests': 'Too many attempts. Please wait a moment.', 'auth/email-not-verified': 'Please verify your email before signing in.' }; return messages[error?.code] || error?.message || 'Something went wrong. Please try again.'; }

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); const [profile, setProfile] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { if (DEV_AUTH_BYPASS) { setLoading(false); return undefined; } return onAuthStateChanged(auth, async user => { setCurrentUser(user); if (!user) { setProfile(null); setLoading(false); return; } try { const result = await api('/me', user); setProfile(makeProfile(result.employee, user)); } catch { setProfile(null); } finally { setLoading(false); } }); }, []);
  const value = useMemo(() => { const role = profile?.role || 'employee'; return {
    currentUser, profile, role, loading, friendlyAuthError,
    register: async ({ fullName, employeeId, role: selectedRole, email, password }) => { const credential = await createUserWithEmailAndPassword(auth, email, password); const user = credential.user; try { await updateProfile(user, { displayName: fullName }); await api('/auth/profile', user, { method: 'POST', body: JSON.stringify({ fullName, employeeCode: employeeId, role: selectedRole, email }) }); await sendEmailVerification(user); await signOut(auth); return { user }; } catch (error) { await signOut(auth).catch(() => {}); throw error; } },
    login: async ({ email, password }) => { if (DEV_AUTH_BYPASS) { const result = await devLogin(email); const user = { uid: result.employee.firebase_uid, email: result.employee.email, displayName: `${result.employee.first_name} ${result.employee.last_name}` }; const nextProfile = makeProfile(result.employee, user); setCurrentUser(user); setProfile(nextProfile); return { user, profile: nextProfile }; } const credential = await signInWithEmailAndPassword(auth, email, password); const user = credential.user; if (!user.emailVerified) { await signOut(auth); throw Object.assign(new Error('Please verify your email before signing in.'), { code: 'auth/email-not-verified' }); } const result = await api('/me', user); const nextProfile = makeProfile(result.employee, user); setProfile(nextProfile); return { user, profile: nextProfile }; },
    logout: async () => { setCurrentUser(null); setProfile(null); await signOut(auth).catch(() => {}); }, getHomeRoute: nextRole => nextRole === 'admin' || nextRole === 'hr' ? '/admin' : '/employee',
  }; }, [currentUser, profile, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within an AuthProvider.'); return context; }
