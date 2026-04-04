import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';

import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/Page404';

import DashboardApp from './pages/DashboardApp';
import ProfilePage from './pages/Profile';
import User from './pages/User';
import Internship from './pages/Internship';
import StudentProfile from './pages/StudentProfile';
import Sector from './pages/Sector';

// ----------------------------------------------------------------------

export default function Router() {
  const isAuthenticated = !!localStorage.getItem('token'); // Check if user is authenticated

  const handleDateChange = (date) => {
    console.log('Selected date:', date);
  }
  return useRoutes([
    {
      path: '/dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'profile', element: <ProfilePage /> },
        { path: 'user', element: <User /> },
        { path: 'internship', element: <Internship /> },
        { path: 'sector', element: <Sector /> },
        { path: 'student-profile', element: <StudentProfile /> },

      ],
    },
    {
      path: 'login',
      element: !isAuthenticated ? <Login /> : <Navigate to="/dashboard/app" />,
    },
    {
      path: 'register',
      element: !isAuthenticated ? <Register /> : <Navigate to="/dashboard/app" />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/app" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}


