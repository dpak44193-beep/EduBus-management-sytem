import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Users, Car, Bus, MapPin, AlertTriangle, CheckCircle2,
  TrendingUp, Clock, Bell, Activity, ArrowUpRight, Shield
} from 'lucide-react';
import { LiveMap } from '../../components/map/LiveMap';
import {
  students, drivers, buses, emergencyAlerts, notifications,
  weeklyAttendance, getDriverByBus
} from '../../data/mockData';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Link } from 'react-router';

const StatCard = ({ title, value, sub, icon: Icon, color, trend }: {
  title: string; value: string | number; sub?: string; icon: React.ElementType;
  color: string; trend?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-start gap-4 hover:shadow-md transition-shadow"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">{title}</div>
      <div className="text-slate-800 text-2xl font-extrabold mt-0.5">{value}</div>
      {sub && <div className="text-slate-400 text-xs mt-0.5">{sub}</div>}
    </div>
    {trend && (
      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-0.5">
        <ArrowUpRight className="w-3 h-3" />{trend}
      </span>
    )}
  </motion.div>
);

export function AdminDashboard() {
  const presentToday = students.filter(s => s.status === 'in' || s.status === 'out').length;
  const absentToday = students.filter(s => s.status === 'absent').length;
  const activeDrivers = drivers.filter(d => d.status === 'on-route').length;
  const unresolved = emergencyAlerts.filter(e => !e.resolved).length;
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-5 text-white flex items-center justify-between"
      >
        <div>
          <div className="text-blue-200 text-sm">Good Morning, Admin!</div>
          <div className="text-xl font-bold mt-0.5">Today is Thursday, April 2, 2026</div>
          <div className="text-blue-200 text-sm mt-1">All 3 buses are currently active on route 🚌</div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-3xl font-mono font-bold">
            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="flex items-center gap-1.5 justify-end mt-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
            <span className="text-blue-200 text-xs">System Live</span>
          </div>
        </div>
      </motion.div>

      {/* Emergency Alert Banner */}
      {unresolved > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3"
        >
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-red-700 font-semibold text-sm">
              🚨 {unresolved} Unresolved Emergency Alert!
            </span>
            <span className="text-red-600 text-sm ml-2">
              {emergencyAlerts.find(e => !e.resolved)?.message}
            </span>
          </div>
          <Link to="/admin/drivers" className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-red-600 transition-colors">
            View
          </Link>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Students" value={students.length} sub="Across 3 buses" icon={Users} color="bg-blue-500" trend="+2 this week" />
        <StatCard title="Present Today" value={presentToday} sub={`${absentToday} absent`} icon={CheckCircle2} color="bg-emerald-500" />
        <StatCard title="Active Buses" value={`${activeDrivers}/3`} sub="All routes running" icon={Bus} color="bg-violet-500" />
        <StatCard title="Drivers On Duty" value={activeDrivers} sub="3 total registered" icon={Car} color="bg-amber-500" />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live Map - 2/3 */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-slate-800">Live Bus Tracking</span>
            </div>
            <Link to="/admin/tracking" className="text-xs text-blue-600 hover:underline font-semibold">
              Full View →
            </Link>
          </div>
          <div className="p-4">
            <LiveMap showAllBuses height={300} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Bus Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-slate-600" />
              <span className="font-bold text-slate-800 text-sm">Bus Status</span>
            </div>
            <div className="space-y-3">
              {buses.map(bus => {
                const driver = getDriverByBus(bus.id);
                const occupied = students.filter(s => s.busId === bus.id && s.status === 'in').length;
                return (
                  <div key={bus.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Bus className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-700 truncate">{bus.busNumber}</span>
                        <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full">Active</span>
                      </div>
                      <div className="text-xs text-slate-400">{driver?.name} · {occupied} on board</div>
                      <div className="w-full bg-slate-100 rounded-full h-1 mt-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full transition-all"
                          style={{ width: `${(occupied / bus.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="font-bold text-slate-800 text-sm mb-3">Quick Actions</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Add Student', icon: Users, to: '/admin/students', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
                { label: 'Add Driver', icon: Car, to: '/admin/drivers', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600' },
                { label: 'Attendance', icon: CheckCircle2, to: '/admin/attendance', iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
                { label: 'Analytics', icon: TrendingUp, to: '/admin/analytics', iconBg: 'bg-amber-100', iconColor: 'text-amber-600' },
              ].map(a => {
                const Icon = a.icon;
                return (
                  <Link
                    key={a.label}
                    to={a.to}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-center group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform ${a.iconBg}`}>
                      <Icon className={`w-4 h-4 ${a.iconColor}`} />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{a.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Attendance Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-slate-800">Weekly Attendance Trend</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyAttendance}>
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="present" name="Present" stroke="#3B82F6" fill="url(#presentGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="absent" name="Absent" stroke="#EF4444" fill="url(#absentGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-500" />
              <span className="font-bold text-slate-800">Recent Alerts</span>
            </div>
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 5).map(n => (
              <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl ${n.priority === 'high' ? 'bg-red-50' : 'bg-slate-50'}`}>
                <span className="text-base flex-shrink-0">
                  {n.type === 'pickup' ? '🟢' : n.type === 'drop' ? '🔵' : n.type === 'emergency' ? '🚨' : n.type === 'alert' ? '⚠️' : 'ℹ️'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">{n.timestamp}</span>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Students Overview */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-slate-800">Today's Student Status</span>
          </div>
          <Link to="/admin/students" className="text-xs text-blue-600 hover:underline font-semibold">
            Manage All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="text-xs font-semibold text-slate-500 uppercase pb-3">Student</th>
                <th className="text-xs font-semibold text-slate-500 uppercase pb-3">Grade</th>
                <th className="text-xs font-semibold text-slate-500 uppercase pb-3">Bus</th>
                <th className="text-xs font-semibold text-slate-500 uppercase pb-3">Pickup</th>
                <th className="text-xs font-semibold text-slate-500 uppercase pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map(s => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                        style={{ background: s.color }}
                      >
                        {s.initials}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-700">{s.name}</div>
                        <div className="text-xs text-slate-400">{s.rollNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-sm text-slate-600">{s.grade}</td>
                  <td className="py-2.5 pr-4 text-xs text-slate-500">{s.busId.toUpperCase()}</td>
                  <td className="py-2.5 pr-4 text-xs text-slate-500">{s.pickupPoint}</td>
                  <td className="py-2.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      s.status === 'in' ? 'bg-emerald-100 text-emerald-700' :
                      s.status === 'out' ? 'bg-blue-100 text-blue-700' :
                      s.status === 'absent' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {s.status === 'in' ? '✓ On Bus' : s.status === 'out' ? '⬇ Dropped' : s.status === 'absent' ? '✗ Absent' : '⏳ Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}