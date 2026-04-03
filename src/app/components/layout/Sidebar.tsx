import { NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard, Users, Car, MapPin, ClipboardList,
  BarChart3, Route, LogOut, Bell, Shield, User,
  Navigation, BookOpen, PhoneCall, X, Bus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notifications } from '../../data/mockData';
import { useState } from 'react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/drivers', label: 'Drivers', icon: Car },
  { to: '/admin/tracking', label: 'Live Tracking', icon: MapPin },
  { to: '/admin/attendance', label: 'Attendance', icon: ClipboardList },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/routes', label: 'Routes', icon: Route },
];

const driverNav = [
  { to: '/driver', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/driver/students', label: 'My Students', icon: Users },
  { to: '/driver/tracking', label: 'Live Tracking', icon: Navigation },
  { to: '/driver/attendance', label: 'Mark Attendance', icon: ClipboardList },
];

const studentNav = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/tracking', label: 'Bus Location', icon: MapPin },
  { to: '/student/attendance', label: 'My Attendance', icon: ClipboardList },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
];

const parentNav = [
  { to: '/parent', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/parent/tracking', label: 'Live Tracking', icon: MapPin },
  { to: '/parent/child', label: 'My Child', icon: User },
  { to: '/parent/attendance', label: 'Attendance', icon: BookOpen },
  { to: '/parent/contact', label: 'Contact Driver', icon: PhoneCall },
];

const navByRole: Record<string, typeof adminNav> = {
  admin: adminNav,
  driver: driverNav,
  student: studentNav,
  parent: parentNav,
};

const roleColors: Record<string, string> = {
  admin: 'from-blue-700 to-blue-900',
  driver: 'from-emerald-700 to-emerald-900',
  student: 'from-violet-700 to-violet-900',
  parent: 'from-orange-600 to-orange-800',
};

const roleLabels: Record<string, string> = {
  admin: 'Administrator',
  driver: 'Bus Driver',
  student: 'Student',
  parent: 'Parent',
};

const roleIcons: Record<string, React.ElementType> = {
  admin: Shield,
  driver: Bus,
  student: BookOpen,
  parent: User,
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const role = currentUser?.role ?? 'admin';
  const navItems = navByRole[role] ?? adminNav;
  const unreadCount = notifications.filter(n => !n.read && n.targetRoles.includes(role)).length;
  const RoleIcon = roleIcons[role];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col bg-gradient-to-b ${roleColors[role]} shadow-2xl transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto w-64`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight">BusTrack</div>
            <div className="text-white/60 text-xs">Management System</div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-white/70 hover:text-white p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User profile */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
              <RoleIcon className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-white font-semibold text-sm truncate">{currentUser?.name}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                <span className="text-white/60 text-xs">{roleLabels[role]}</span>
              </div>
            </div>
            {unreadCount > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="text-white/40 text-xs font-semibold uppercase tracking-wider px-2 mb-3">
            Main Menu
          </div>
          <ul className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                      ${isActive
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                    {item.label}
                    {item.label === 'Notifications' && unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-4 border-t border-white/10 pt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-300 text-sm font-medium transition-all"
          >
            <LogOut className="w-4.5 h-4.5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
