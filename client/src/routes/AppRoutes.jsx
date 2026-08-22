import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import EmployeeDashboard from '../pages/employee/Dashboard';
import AdminDashboard from '../pages/admin/Dashboard';
import Login from '../pages/auth/login';
import Signup from '../pages/auth/signup';
import LeaveRequests from '../pages/employee/LeaveRequests';
import { useAuth } from '../context/AuthContext.jsx';

function LoadingScreen() {
  return (
    <main className="auth-page" style={{ placeItems: 'center' }}>
      <div className="login-card" style={{ margin: 'auto' }}>
        <h2>Loading Dayflow</h2>
        <p>Checking your Firebase session...</p>
      </div>
    </main>
  );
}

function PublicRoute({ children }) {
  const { loading, currentUser, role, getHomeRoute } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (currentUser) {
    return <Navigate to={getHomeRoute(role)} replace />;
  }

  return children;
}

function ProtectedRoute({ children, allowedRole, allowedRoles }) {
  const { loading, currentUser, role, getHomeRoute } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const permittedRoles = allowedRoles || (allowedRole ? [allowedRole] : null);
  if (permittedRoles && !permittedRoles.includes(role)) {
    return <Navigate to={getHomeRoute(role)} replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/employee" element={<ProtectedRoute allowedRole="employee"><EmployeeDashboard /></ProtectedRoute>} />
        <Route path="/employee/leave" element={<ProtectedRoute allowedRole="employee"><LeaveRequests /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin', 'hr']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
