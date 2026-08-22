import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

const AuthContext = createContext(null);

const profileKey = (uid) => `dayflow.profile.${uid}`;
const emailKey = (email) => `dayflow.profile.email.${email.trim().toLowerCase()}`;

const storage = {
  get(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Storage is best effort only.
    }
  },
};

function makeProfile(user, data = {}) {
  return {
    uid: user.uid,
    email: user.email ?? data.email ?? '',
    fullName: data.fullName ?? user.displayName ?? '',
    employeeId: data.employeeId ?? '',
    role: data.role ?? 'employee',
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

async function loadProfile(user) {
  const snapshot = await getDoc(doc(db, 'users', user.uid));

  if (snapshot.exists()) {
    return makeProfile(user, snapshot.data());
  }

  const storedByUid = storage.get(profileKey(user.uid));
  if (storedByUid) {
    return makeProfile(user, JSON.parse(storedByUid));
  }

  if (user.email) {
    const storedByEmail = storage.get(emailKey(user.email));
    if (storedByEmail) {
      return makeProfile(user, JSON.parse(storedByEmail));
    }
  }

  return makeProfile(user);
}

async function saveProfile(user, data) {
  const profile = makeProfile(user, data);

  try {
    await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
  } catch {
    // Firestore is best effort; local storage still keeps the app usable.
  }
  storage.set(profileKey(user.uid), JSON.stringify(profile));

  if (profile.email) {
    storage.set(emailKey(profile.email), JSON.stringify(profile));
  }

  return profile;
}

function friendlyAuthError(error) {
  switch (error?.code) {
    case 'auth/email-already-in-use':
      return 'That email address is already registered.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Please choose a stronger password.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/email-not-verified':
      return 'Please verify your email before signing in.';
    default:
      return error?.message || 'Something went wrong. Please try again.';
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => onAuthStateChanged(auth, async (user) => {
    setCurrentUser(user);

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const savedProfile = await loadProfile(user);
      setProfile(savedProfile);
      storage.set(profileKey(user.uid), JSON.stringify(savedProfile));
      if (savedProfile.email) {
        storage.set(emailKey(savedProfile.email), JSON.stringify(savedProfile));
      }
    } catch {
      setProfile(makeProfile(user));
    } finally {
      setLoading(false);
    }
  }), []);

  const value = useMemo(() => {
    const role = profile?.role || 'employee';

    const register = async ({ fullName, employeeId, role: selectedRole, email, password }) => {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const user = credential.user;

      try {
        await updateProfile(user, { displayName: fullName });

        const profileData = await saveProfile(user, {
          fullName,
          employeeId,
          role: selectedRole,
          email,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        await sendEmailVerification(user);
        await signOut(auth);

        return { user, profile: profileData };
      } catch (error) {
        await signOut(auth).catch(() => {});
        throw error;
      }
    };

    const login = async ({ email, password }) => {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const user = credential.user;

      if (!user.emailVerified) {
        await signOut(auth);
        const verificationError = new Error('Please verify your email before signing in.');
        verificationError.code = 'auth/email-not-verified';
        throw verificationError;
      }

      const profileData = await loadProfile(user);
      const savedProfile = await saveProfile(user, {
        ...profileData,
        email,
        updatedAt: new Date().toISOString(),
      });

      return { user, profile: savedProfile };
    };

    const logout = async () => {
      await signOut(auth);
    };

    const getHomeRoute = (nextRole = role) => (nextRole === 'admin' ? '/admin' : '/employee');

    return {
      currentUser,
      profile,
      role,
      loading,
      register,
      login,
      logout,
      getHomeRoute,
      friendlyAuthError,
    };
  }, [currentUser, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
