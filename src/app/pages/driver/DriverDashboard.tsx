import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Navigation, Phone, AlertTriangle, CheckCircle2, Clock,
  Users, MapPin, Zap, ChevronRight, X, Bus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { drivers, buses, routes, students, getStudentsByBus, getRouteByBus } from '../../data/mockData';
import { LiveMap } from '../../components/map/LiveMap';

type AttendanceStatus = 'pending' | 'in' | 'out' | 'absent';

export function DriverDashboard() {
  const { currentUser } = useAuth();
  const driver = drivers.find(d => d.id === currentUser?.driverId);
  const bus = driver ? buses.find(b => b.id === driver.busId) : null;
  const route = bus ? getRouteByBus(bus.id) : null;
  const myStudents = bus ? getStudentsByBus(bus.id) : [];

  const [trackingActive, setTrackingActive] = useState(true);
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(
    Object.fromEntries(myStudents.map(s => [s.id, s.status as AttendanceStatus]))
  );
  const [emergencyModal, setEmergencyModal] = useState(false);
  const [emergencySent, setEmergencySent] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [speed, setSpeed] = useState(28 + Math.floor(Math.random() * 10));

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentTime(new Date());
      setSpeed(20 + Math.floor(Math.random() * 20));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const markStudent = (id: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const pickedUp = Object.values(attendance).filter(s => s === 'in').length;
  const dropped = Object.values(attendance).filter(s => s === 'out').length;
  const absent = Object.values(attendance).filter(s => s === 'absent').length;
  const pending = Object.values(attendance).filter(s => s === 'pending').length;

  const sendEmergency = () => {
    setEmergencySent(true);
    setTimeout(() => { setEmergencySent(false); setEmergencyModal(false); }, 2000);
  };

  if (!driver || !bus) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        No driver/bus data found. Please contact admin.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Driver Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-5 text-white">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="text-emerald-200 text-sm">Driver Panel</div>
            <div className="text-xl font-bold mt-0.5">{driver.name}</div>
            <div className="text-emerald-200 text-sm mt-1">
              {bus.busNumber} · {route?.name ?? 'No route'} · {myStudents.length} students
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-emerald-200 text-xs mt-1">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* GPS Toggle + Emergency */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* GPS Toggle */}
        <div className={`rounded-2xl p-5 border-2 transition-all ${trackingActive ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Navigation className={`w-5 h-5 ${trackingActive ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="font-bold text-slate-800">GPS Tracking</span>
            </div>
            <button
              onClick={() => setTrackingActive(a => !a)}
              className={`w-14 h-7 rounded-full relative transition-all ${trackingActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${trackingActive ? 'translate-x-8' : 'translate-x-1'}`} />
            </button>
          </div>
          {trackingActive ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-700 font-semibold text-sm">Location Broadcasting Live</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-xl p-2.5 text-center">
                  <div className="text-slate-800 font-bold">{speed}</div>
                  <div className="text-xs text-slate-400">km/h</div>
                </div>
                <div className="bg-white rounded-xl p-2.5 text-center">
                  <div className="text-slate-800 font-bold">{bus.fuel}%</div>
                  <div className="text-xs text-slate-400">Fuel</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-sm">
              Tap to start broadcasting your location to admin and parents.
            </div>
          )}
        </div>

        {/* Emergency */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="font-bold text-slate-800">Emergency Alert</span>
          </div>
          <p className="text-red-600 text-sm mb-4">
            Press the button below to instantly notify admin and parents with your current GPS location.
          </p>
          <button
            onClick={() => setEmergencyModal(true)}
            className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors shadow-md hover:shadow-lg active:scale-95"
          >
            🚨 SEND EMERGENCY ALERT
          </button>
          <a href="tel:9876543210" className="flex items-center justify-center gap-2 mt-2 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors">
            <Phone className="w-4 h-4" />
            Call Admin Directly
          </a>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Picked Up', value: pickedUp, bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', sub: 'text-emerald-600', icon: '✓' },
          { label: 'Dropped', value: dropped, bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-700', sub: 'text-blue-600', icon: '⬇' },
          { label: 'Absent', value: absent, bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-700', sub: 'text-red-600', icon: '✗' },
          { label: 'Pending', value: pending, bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', sub: 'text-amber-600', icon: '⏳' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-3 text-center`}>
            <div className={`${s.text} text-xl font-extrabold`}>{s.icon} {s.value}</div>
            <div className={`${s.sub} text-xs font-medium mt-0.5`}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Live Map */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
          <MapPin className="w-5 h-5 text-emerald-500" />
          <span className="font-bold text-slate-800">Your Live Route</span>
          <span className="ml-auto text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-semibold">
            {route?.name}
          </span>
        </div>
        <div className="p-4">
          <LiveMap
            highlightBusId={bus.id}
            showAllBuses={false}
            selectedRouteId={route?.id}
            height={280}
          />
        </div>
      </div>

      {/* Student Attendance */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-slate-800">Mark Student Attendance</span>
          </div>
          <span className="text-xs text-slate-400">{pickedUp}/{myStudents.length} picked up</span>
        </div>
        <div className="p-4 space-y-3">
          {myStudents.map(s => {
            const status = attendance[s.id] ?? 'pending';
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  status === 'in' ? 'bg-emerald-50 border-emerald-200' :
                  status === 'out' ? 'bg-blue-50 border-blue-200' :
                  status === 'absent' ? 'bg-red-50 border-red-200' :
                  'bg-slate-50 border-slate-200'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ background: s.color }}
                >
                  {s.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm">{s.name}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{s.rollNumber}</span>
                    <span>·</span>
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{s.pickupPoint}</span>
                  </div>
                  {status === 'in' && (
                    <div className="flex items-center gap-1 text-xs text-emerald-600 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>Picked up at {s.lastPickup || currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => markStudent(s.id, 'in')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      status === 'in'
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
                    }`}
                  >
                    IN
                  </button>
                  <button
                    onClick={() => markStudent(s.id, 'out')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      status === 'out'
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    OUT
                  </button>
                  <button
                    onClick={() => markStudent(s.id, 'absent')}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      status === 'absent'
                        ? 'bg-red-500 text-white shadow-sm'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                  >
                    ABS
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Route Stops */}
      {route && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="font-bold text-slate-800 mb-4">Today's Route Stops</div>
          <div className="space-y-2">
            {route.stops.map((stop, i) => {
              const stopStudents = myStudents.filter(s => stop.studentIds.includes(s.id));
              const allPickedUp = stopStudents.every(s => attendance[s.id] === 'in' || attendance[s.id] === 'out' || attendance[s.id] === 'absent');
              return (
                <div key={stop.id} className={`flex items-center gap-3 p-3 rounded-xl ${allPickedUp && stopStudents.length > 0 ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                  <div className={`w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center flex-shrink-0 ${allPickedUp && stopStudents.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    {allPickedUp && stopStudents.length > 0 ? '✓' : i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-700 text-sm">{stop.name}</div>
                    <div className="text-xs text-slate-400">
                      {stop.time} · {stopStudents.length} student{stopStudents.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  {stopStudents.length > 0 && (
                    <div className="flex gap-1">
                      {stopStudents.map(s => (
                        <span key={s.id} className="text-xs px-2 py-0.5 rounded-full text-white" style={{ background: s.color }}>
                          {s.initials}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Emergency Modal */}
      <AnimatePresence>
        {emergencyModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
            >
              {emergencySent ? (
                <div className="py-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
                  <div className="font-bold text-slate-800 text-lg">Alert Sent!</div>
                  <div className="text-slate-500 text-sm mt-1">Admin and parents have been notified.</div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-xl mb-2">Send Emergency Alert?</h3>
                  <p className="text-slate-500 text-sm mb-2">
                    This will immediately notify the admin and all parents with your current GPS location.
                  </p>
                  <div className="bg-slate-50 rounded-xl p-3 mb-5 text-left text-xs text-slate-600">
                    <div>📍 Location: Near {route?.stops[1]?.name ?? 'current position'}</div>
                    <div>🚌 Bus: {bus.busNumber}</div>
                    <div>⏰ Time: {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEmergencyModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={sendEmergency}
                      className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors"
                    >
                      🚨 SEND NOW
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}