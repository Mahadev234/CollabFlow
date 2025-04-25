import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AuthRoute from '../components/common/AuthRoute';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import VerifyEmail from '../pages/auth/VerifyEmail';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

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

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthRoute />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'verify-email', element: <VerifyEmail /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: '*', element: <Login /> },
    ],
  },
  {
    path: '/error',
    children: [
      { path: '404', element: <NotFound /> },
      { path: '500', element: <ServerError /> },
      { path: '403', element: <Unauthorized /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      {
        path: 'boards',
        children: [
          { path: ':boardId', element: <Board /> },
          { path: '*', element: <Dashboard /> },
        ],
      },
      {
        path: 'projects',
        children: [
          { index: true, element: <ProjectsList /> },
          { path: 'create', element: <CreateProject /> },
          { path: '*', element: <ProjectsList /> },
        ],
      },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
      { path: 'notifications', element: <NotificationCenter /> },
      { path: 'help', element: <Help /> },
      { path: '*', element: <Dashboard /> },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
  {
    path: '/404',
    element: <NotFound />,
  },
  {
    path: '/500',
    element: <ServerError />,
  },
  {
    path: '/403',
    element: <Unauthorized />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
} 