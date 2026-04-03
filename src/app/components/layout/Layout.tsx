import { useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../context/AuthContext';

const titleMap: Record<string, string> = {
  '/admin': 'Admin Dashboard',
  '/admin/students': 'Student Management',
  '/admin/drivers': 'Driver Management',
  '/admin/tracking': 'Live Bus Tracking',
  '/admin/attendance': 'Attendance Reports',
  '/admin/analytics': 'Analytics & Reports',
  '/admin/routes': 'Route Management',
  '/driver': 'Driver Dashboard',
  '/driver/students': 'Assigned Students',
  '/driver/tracking': 'GPS Tracking',
  '/driver/attendance': 'Mark Attendance',
  '/student': 'Student Dashboard',
  '/student/tracking': 'Bus Location',
  '/student/attendance': 'My Attendance',
  '/student/notifications': 'Notifications',
  '/parent': 'Parent Dashboard',
  '/parent/tracking': 'Live Tracking',
  '/parent/child': "My Child's Status",
  '/parent/attendance': 'Attendance History',
  '/parent/contact': 'Contact Driver',
};

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = titleMap[location.pathname] ?? 'BusTrack';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
