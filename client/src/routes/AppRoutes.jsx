import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import EmployeeDashboard from '../pages/employee/Dashboard';
import AdminDashboard from '../pages/admin/Dashboard';
import Login from '../pages/auth/login';
import Signup from '../pages/auth/signup';
import LeaveRequests from '../pages/employee/LeaveRequests';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/leave" element={<LeaveRequests />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
