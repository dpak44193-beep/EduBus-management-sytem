import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Bell, Clock, CheckCircle2, Bus, Shield, AlertTriangle, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { students, buses, drivers, routes, attendanceRecords, notifications } from '../../data/mockData';
import { LiveMap } from '../../components/map/LiveMap';

export function ParentDashboard() {
  const { currentUser } = useAuth();
  // Find child for this parent
  const child = students.find(s => s.id === currentUser?.studentId) ?? students[0];
  const bus = buses.find(b => b.id === child.busId);
  const driver = drivers.find(d => d.id === bus?.driverId);
  const route = routes.find(r => r.busId === child.busId);

  const childAttendance = attendanceRecords.filter(r => r.studentId === child.id);
  const presentCount = childAttendance.filter(r => r.status !== 'absent').length;
  const attendancePct = childAttendance.length > 0 ? Math.round((presentCount / childAttendance.length) * 100) : 100;

  const myNotifs = notifications.filter(n => n.targetRoles.includes('parent') && (n.studentId === child.id || !n.studentId));
  const unreadCount = myNotifs.filter(n => !n.read).length;

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const [callAlertVisible, setCallAlertVisible] = useState(false);

  const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string; desc: string }> = {
    in: { label: 'On the Bus', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-300', icon: '🚌', desc: 'Your child is safely on board' },
    out: { label: 'Dropped Off', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-300', icon: '🏠', desc: 'Your child has reached home' },
    absent: { label: 'Absent Today', color: 'text-red-700', bg: 'bg-red-50 border-red-300', icon: '❌', desc: 'Your child was not on the bus today' },
    pending: { label: 'Awaiting Pickup', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-300', icon: '⏳', desc: 'Bus is on the way to pickup point' },
  };

  const status = statusConfig[child.status] ?? statusConfig['pending'];
  const childStop = route?.stops.find(s => s.studentIds.includes(child.id));

  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-700 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-orange-200 text-sm">Parent Dashboard</div>
            <div className="text-xl font-bold mt-0.5">{currentUser?.name}</div>
            <div className="text-orange-200 text-sm mt-1">
              Monitoring: {child.name}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            {unreadCount > 0 && (
              <div className="mt-1 text-xs bg-red-500 text-white px-2.5 py-1 rounded-full font-semibold">
                {unreadCount} new alerts
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Child Status - LARGE CARD */}
      <div className={`rounded-2xl p-5 border-2 transition-all ${status.bg}`}>
        <div className="flex items-start gap-4">
          <div className="text-5xl">{status.icon}</div>
          <div className="flex-1">
            <div className={`font-extrabold text-xl ${status.color}`}>{status.label}</div>
            <div className="text-slate-600 text-sm mt-0.5">{status.desc}</div>
            <div className="flex flex-wrap gap-4 mt-3">
              {child.lastPickup && child.lastPickup !== '--' && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-slate-600">Pickup: <strong>{child.lastPickup}</strong></span>
                </div>
              )}
              {child.lastDrop && child.lastDrop !== '--' && (
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-slate-600">Drop: <strong>{child.lastDrop}</strong></span>
                </div>
              )}
              {childStop && (
                <div className="flex items-center gap-1.5 text-sm">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span className="text-slate-600">Stop: <strong>{childStop.name}</strong></span>
                </div>
              )}
            </div>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ background: child.color }}
          >
            {child.initials}
          </div>
        </div>
      </div>

      {/* Live Map */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            <span className="font-bold text-slate-800">Live Bus Location</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            Live
          </div>
        </div>
        <div className="p-4">
          <LiveMap highlightBusId={bus?.id} showAllBuses={false} selectedRouteId={route?.id} height={280} />
        </div>
        {bus && (
          <div className="px-5 pb-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-3">
            <div className="text-center">
              <div className="font-bold text-slate-800 text-sm">{bus.busNumber}</div>
              <div className="text-xs text-slate-400">Bus No.</div>
            </div>
            <div className="text-center border-x border-slate-100">
              <div className="font-bold text-slate-800 text-sm">{bus.speed} km/h</div>
              <div className="text-xs text-slate-400">Speed</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-emerald-600 text-sm">Active</div>
              <div className="text-xs text-slate-400">Status</div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Driver + Emergency */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Call Driver */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-orange-500" />
            Contact Driver
          </div>
          {driver && (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: driver.color }}>
                {driver.initials}
              </div>
              <div>
                <div className="font-semibold text-slate-800">{driver.name}</div>
                <div className="text-sm text-slate-500">{driver.phone}</div>
                <div className="text-xs text-emerald-600 font-semibold">🟢 On Route</div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <a
              href={`tel:${driver?.phone}`}
              onClick={() => setCallAlertVisible(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-colors shadow-md"
            >
              <Phone className="w-4 h-4" />
              📞 Call Driver Now
            </a>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-orange-200 text-orange-600 text-sm font-semibold hover:bg-orange-50 transition-colors">
              <MessageSquare className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </div>

        {/* Safety Info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            Safety Information
          </div>
          <div className="space-y-3">
            {[
              { icon: '🔒', title: 'OTP Verified', sub: 'Parent account verified via OTP', ok: true },
              { icon: '📍', title: 'GPS Tracking', sub: 'Bus location is live and accurate', ok: true },
              { icon: '🚌', title: 'Bus Condition', sub: 'All safety checks passed', ok: true },
              { icon: '👨‍✈️', title: 'Driver License', sub: `Valid until ${new Date().getFullYear() + 1}`, ok: true },
            ].map(item => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-slate-700">{item.title}</div>
                  <div className="text-xs text-slate-400">{item.sub}</div>
                </div>
                <CheckCircle2 className={`w-4 h-4 ${item.ok ? 'text-emerald-500' : 'text-red-400'}`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance History */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-slate-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-500" />
            {child.name}'s Attendance History
          </div>
          <div className={`text-sm font-bold px-3 py-1 rounded-full ${attendancePct >= 75 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {attendancePct}% Overall
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-3 py-2">Date</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-3 py-2">Pickup</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-3 py-2">Drop</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {childAttendance.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2.5 text-sm text-slate-600">
                    {new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-3 py-2.5 text-sm">
                    {r.inTime !== '--' ? (
                      <span className="text-emerald-600 font-medium">{r.inTime}</span>
                    ) : (
                      <span className="text-slate-400">--</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-sm">
                    {r.outTime !== '--' ? (
                      <span className="text-blue-600 font-medium">{r.outTime}</span>
                    ) : (
                      <span className="text-slate-400">--</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      r.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                      r.status === 'absent' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {r.status === 'present' ? '✓ Present' : r.status === 'absent' ? '✗ Absent' : '⚠ Late'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="font-bold text-slate-800 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-500" />
            Notifications
          </div>
          {unreadCount > 0 && (
            <span className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-full font-semibold">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="space-y-2">
          {myNotifs.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm">No notifications</div>
          ) : (
            myNotifs.map(n => (
              <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl ${!n.read ? 'bg-orange-50' : 'bg-slate-50'}`}>
                <span className="text-base flex-shrink-0">
                  {n.type === 'pickup' ? '🟢' : n.type === 'drop' ? '🔵' : n.type === 'alert' ? '⚠️' : n.type === 'emergency' ? '🚨' : 'ℹ️'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">{n.timestamp}</span>
                    {n.priority === 'high' && <span className="text-xs text-red-600 font-semibold">URGENT</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
