import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import Dashboard from '../pages/Dashboard';
import Board from '../pages/Board';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyEmail from '../pages/auth/VerifyEmail';
import NotificationCenter from '../pages/notifications/NotificationCenter';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';
import Help from '../pages/help/Help';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="board/:boardId" element={<Board />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* Redirect any unmatched routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}; 