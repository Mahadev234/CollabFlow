import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AuthRoute from '../components/common/AuthRoute';
import Dashboard from '../pages/Dashboard';
import Board from '../pages/Board';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ForgotPassword from '../pages/auth/ForgotPassword';
import NotificationCenter from '../pages/notifications/NotificationCenter';
import Profile from '../pages/profile/Profile';
import Settings from '../pages/settings/Settings';
import Help from '../pages/help/Help';
import ProjectsList from '../pages/projects/ProjectsList';
import CreateProject from '../pages/projects/CreateProject';
import NotFound from '../pages/errors/NotFound';
import ServerError from '../pages/errors/ServerError';
import Unauthorized from '../pages/errors/Unauthorized';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/register"
        element={
          <AuthRoute>
            <Register />
          </AuthRoute>
        }
      />
      <Route
        path="/verify-email"
        element={
          <AuthRoute>
            <VerifyEmail />
          </AuthRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
        }
      />
      
      {/* Error Routes */}
      <Route path="/404" element={<NotFound />} />
      <Route path="/500" element={<ServerError />} />
      <Route path="/403" element={<Unauthorized />} />
      
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
        
        {/* Project Routes */}
        <Route path="projects">
          <Route index element={<ProjectsList />} />
          <Route path="create" element={<CreateProject />} />
        </Route>
      </Route>

      {/* Redirect any unmatched routes to 404 */}
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}; 