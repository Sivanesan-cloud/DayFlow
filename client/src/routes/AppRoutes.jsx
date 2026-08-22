import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import EmployeeDashboard from '../pages/employee/Dashboard';
import AdminDashboard from '../pages/admin/Dashboard';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/employee" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
