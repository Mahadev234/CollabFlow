import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AuthRoute from '../components/common/AuthRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Error Pages
import NotFound from '../pages/errors/NotFound';
import ServerError from '../pages/errors/ServerError';
import Unauthorized from '../pages/errors/Unauthorized';

// Protected Pages
import Dashboard from '../pages/Dashboard';
import Board from '../pages/Board';
import NotificationCenter from '../pages/notifications/NotificationCenter';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';
import Help from '../pages/help/Help';
import ProjectsList from '../pages/projects/ProjectsList';
import CreateProject from '../pages/projects/CreateProject';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes - Only accessible when not logged in */}
      <Route
        path="/auth"
        element={
          <AuthRoute>
            <Routes>
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="verify-email" element={<VerifyEmail />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<Navigate to="/auth/login" replace />} />
            </Routes>
          </AuthRoute>
        }
      />

      {/* Error Routes - Accessible to all */}
      <Route path="/error">
        <Route path="404" element={<NotFound />} />
        <Route path="500" element={<ServerError />} />
        <Route path="403" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/error/404" replace />} />
      </Route>

      {/* Protected Routes - Only accessible when logged in */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Boards */}
        <Route path="boards">
          <Route path=":boardId" element={<Board />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Projects */}
        <Route path="projects">
          <Route index element={<ProjectsList />} />
          <Route path="create" element={<CreateProject />} />
          <Route path="*" element={<Navigate to="/projects" replace />} />
        </Route>

        {/* User Related */}
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="help" element={<Help />} />

        {/* Catch all for protected routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>

      {/* Redirects */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/register" element={<Navigate to="/auth/register" replace />} />
      <Route path="/verify-email" element={<Navigate to="/auth/verify-email" replace />} />
      <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />
      <Route path="/404" element={<Navigate to="/error/404" replace />} />
      <Route path="/500" element={<Navigate to="/error/500" replace />} />
      <Route path="/403" element={<Navigate to="/error/403" replace />} />

      {/* Catch all unmatched routes */}
      <Route path="*" element={<Navigate to="/error/404" replace />} />
    </Routes>
  );
}; 