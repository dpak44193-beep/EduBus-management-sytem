import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Students } from './pages/admin/Students';
import { Drivers } from './pages/admin/Drivers';
import { BusTracking } from './pages/admin/BusTracking';
import { Attendance } from './pages/admin/Attendance';
import { Analytics } from './pages/admin/Analytics';
import { RouteManagement } from './pages/admin/RouteManagement';
import { DriverDashboard } from './pages/driver/DriverDashboard';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ParentDashboard } from './pages/parent/ParentDashboard';


function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
      <span className="text-6xl mb-4">🚌</span>
      <div className="font-bold text-slate-600 text-xl mb-2">Page Not Found</div>
      <p className="text-sm">The page you're looking for doesn't exist.</p>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: '/login', Component: Login },
  { path: '/', element: <Navigate to="/login" replace /> },
  {
    path: '/',
    Component: Layout,
    children: [
      // Admin Routes
      { path: 'admin', Component: AdminDashboard },
      { path: 'admin/students', Component: Students },
      { path: 'admin/drivers', Component: Drivers },
      { path: 'admin/tracking', Component: BusTracking },
      { path: 'admin/attendance', Component: Attendance },
      { path: 'admin/analytics', Component: Analytics },
      { path: 'admin/routes', Component: RouteManagement },
      // Driver Routes
      { path: 'driver', Component: DriverDashboard },
      { path: 'driver/students', Component: DriverDashboard },
      { path: 'driver/tracking', Component: DriverDashboard },
      { path: 'driver/attendance', Component: DriverDashboard },
      // Student Routes
      { path: 'student', Component: StudentDashboard },
      { path: 'student/tracking', Component: StudentDashboard },
      { path: 'student/attendance', Component: StudentDashboard },
      { path: 'student/notifications', Component: StudentDashboard },
      // Parent Routes
      { path: 'parent', Component: ParentDashboard },
      { path: 'parent/tracking', Component: ParentDashboard },
      { path: 'parent/child', Component: ParentDashboard },
      { path: 'parent/attendance', Component: ParentDashboard },
      { path: 'parent/contact', Component: ParentDashboard },
      // Fallback
      { path: '*', Component: NotFound },
    ],
  },
]);
