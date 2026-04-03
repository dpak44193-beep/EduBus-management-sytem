import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Bell, CheckCircle2, XCircle, Bus, Route, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { students, buses, drivers, routes, attendanceRecords, notifications } from '../../data/mockData';
import { LiveMap } from '../../components/map/LiveMap';

export function StudentDashboard() {
  const { currentUser } = useAuth();
  const student = students.find(s => s.id === currentUser?.studentId) ?? students[0];
  const bus = buses.find(b => b.id === student.busId);
  const driver = drivers.find(d => d.id === bus?.driverId);
  const route = routes.find(r => r.busId === student.busId);

  const myNotifs = notifications.filter(n => n.targetRoles.includes('student') && (n.studentId === student.id || !n.studentId));
  const myAttendance = attendanceRecords.filter(r => r.studentId === student.id);
  const presentCount = myAttendance.filter(r => r.status !== 'absent').length;
  const attendancePct = myAttendance.length > 0 ? Math.round((presentCount / myAttendance.length) * 100) : 100;

  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Find next stop
  const myStop = route?.stops.find(s => s.studentIds.includes(student.id));
  const stopIdx = route?.stops.findIndex(s => s.studentIds.includes(student.id)) ?? 0;
  const prevStop = stopIdx > 0 ? route?.stops[stopIdx - 1] : null;

  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-violet-200 text-sm">Good Morning!</div>
            <div className="text-xl font-bold mt-0.5">{student.name}</div>
            <div className="text-violet-200 text-sm mt-1">
              {student.grade} · Roll No: {student.rollNumber}
            </div>
          </div>
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            {student.initials}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <div className="font-bold text-lg">{attendancePct}%</div>
            <div className="text-violet-200 text-xs">Attendance</div>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <div className="font-bold text-lg capitalize">{student.status === 'in' ? 'On Bus' : student.status === 'out' ? 'Dropped' : student.status === 'absent' ? 'Absent' : 'Pending'}</div>
            <div className="text-violet-200 text-xs">Today Status</div>
          </div>
          <div className="bg-white/15 rounded-xl p-3 text-center">
            <div className="font-bold text-lg">{bus?.id.toUpperCase()}</div>
            <div className="text-violet-200 text-xs">My Bus</div>
          </div>
        </div>
      </div>

      {/* Current Status Card */}
      <div className={`rounded-2xl p-5 border-2 ${
        student.status === 'in' ? 'bg-emerald-50 border-emerald-300' :
        student.status === 'out' ? 'bg-blue-50 border-blue-300' :
        student.status === 'absent' ? 'bg-red-50 border-red-300' :
        'bg-amber-50 border-amber-300'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
            student.status === 'in' ? 'bg-emerald-100' :
            student.status === 'out' ? 'bg-blue-100' :
            student.status === 'absent' ? 'bg-red-100' : 'bg-amber-100'
          }`}>
            {student.status === 'in' ? '🚌' : student.status === 'out' ? '🏠' : student.status === 'absent' ? '❌' : '⏳'}
          </div>
          <div>
            <div className="font-bold text-slate-800 text-lg">
              {student.status === 'in' ? 'You are on the bus!' :
               student.status === 'out' ? 'You have been dropped off' :
               student.status === 'absent' ? 'Marked absent today' :
               'Waiting for pickup'}
            </div>
            {student.status === 'in' && student.lastPickup && (
              <div className="flex items-center gap-1.5 text-sm text-emerald-700">
                <Clock className="w-3.5 h-3.5" />
                Picked up at {student.lastPickup}
              </div>
            )}
            {student.status === 'out' && student.lastDrop && (
              <div className="flex items-center gap-1.5 text-sm text-blue-700">
                <Clock className="w-3.5 h-3.5" />
                Dropped at {student.lastDrop}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Map */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-violet-500" />
            <span className="font-bold text-slate-800">Live Bus Location</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
            Live
          </div>
        </div>
        <div className="p-4">
          <LiveMap highlightBusId={bus?.id} showAllBuses={false} selectedRouteId={route?.id} height={260} />
        </div>
        {bus && route && (
          <div className="px-5 pb-4 flex items-center gap-3 text-sm text-slate-600">
            <Bus className="w-4 h-4 text-slate-400" />
            <span>{bus.busNumber}</span>
            <span>·</span>
            <Route className="w-4 h-4 text-slate-400" />
            <span>{route.name}</span>
            <span>·</span>
            <span>{bus.speed} km/h</span>
          </div>
        )}
      </div>

      {/* My Stop Info */}
      {myStop && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-violet-500" />
            My Pickup Stop
          </div>
          <div className="bg-violet-50 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-violet-600" />
            </div>
            <div>
              <div className="font-bold text-slate-800">{myStop.name}</div>
              <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Scheduled: {myStop.time}</span>
              </div>
              <div className="text-xs text-violet-600 font-semibold mt-1 bg-violet-100 px-2 py-0.5 rounded-full inline-block">
                Stop {(stopIdx ?? 0) + 1} of {route?.stops.length ?? 0}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Schedule */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Pickup Info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="font-bold text-slate-800 mb-3 text-sm">📅 Today's Schedule</div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">🌅</div>
              <div>
                <div className="text-xs text-slate-500">Morning Pickup</div>
                <div className="font-semibold text-slate-700">{student.lastPickup || myStop?.time || '--'}</div>
              </div>
              <CheckCircle2 className={`ml-auto w-5 h-5 ${student.lastPickup && student.lastPickup !== '--' ? 'text-emerald-500' : 'text-slate-200'}`} />
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">🌆</div>
              <div>
                <div className="text-xs text-slate-500">Afternoon Drop</div>
                <div className="font-semibold text-slate-700">{student.lastDrop || route?.afternoonStart || '--'}</div>
              </div>
              <CheckCircle2 className={`ml-auto w-5 h-5 ${student.lastDrop && student.lastDrop !== '--' ? 'text-blue-500' : 'text-slate-200'}`} />
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-violet-500" />
            Attendance Summary
          </div>
          <div className="flex items-center justify-center mb-3">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke={attendancePct >= 75 ? '#22C55E' : '#EF4444'}
                  strokeWidth="10"
                  strokeDasharray={`${attendancePct * 2.51} 251`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold text-slate-800">{attendancePct}%</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-emerald-50 rounded-xl p-2">
              <div className="text-emerald-700 font-bold">{presentCount}</div>
              <div className="text-xs text-emerald-600">Present</div>
            </div>
            <div className="bg-red-50 rounded-xl p-2">
              <div className="text-red-700 font-bold">{myAttendance.length - presentCount}</div>
              <div className="text-xs text-red-600">Absent</div>
            </div>
          </div>
          {attendancePct < 75 && (
            <div className="mt-3 text-xs text-red-600 bg-red-50 rounded-lg p-2 text-center">
              ⚠️ Attendance below 75%. Please improve.
            </div>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Bell className="w-4 h-4 text-violet-500" />
          Recent Notifications
        </div>
        <div className="space-y-2">
          {myNotifs.length === 0 ? (
            <div className="text-center py-6 text-slate-400 text-sm">No notifications</div>
          ) : (
            myNotifs.map(n => (
              <div key={n.id} className={`flex items-start gap-3 p-3 rounded-xl ${!n.read ? 'bg-violet-50' : 'bg-slate-50'}`}>
                <span className="text-base flex-shrink-0">
                  {n.type === 'pickup' ? '🟢' : n.type === 'drop' ? '🔵' : n.type === 'alert' ? '⚠️' : n.type === 'emergency' ? '🚨' : 'ℹ️'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-xs text-slate-400">{n.timestamp}</span>
                    {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />}
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
