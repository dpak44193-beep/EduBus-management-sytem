import { useState } from 'react';
import { motion } from 'motion/react';
import { Bus, Navigation, Users, Fuel, Zap, MapPin, Phone } from 'lucide-react';
import { LiveMap } from '../../components/map/LiveMap';
import { buses, routes, drivers, students } from '../../data/mockData';

export function BusTracking() {
  const [selectedBus, setSelectedBus] = useState<string | null>(null);

  const getBusData = (busId: string) => {
    const bus = buses.find(b => b.id === busId)!;
    const route = routes.find(r => r.busId === busId);
    const driver = drivers.find(d => d.busId === busId);
    const busStudents = students.filter(s => s.busId === busId);
    const onBoard = busStudents.filter(s => s.status === 'in').length;
    return { bus, route, driver, busStudents, onBoard };
  };

  const busClasses: Record<string, { btn: string; btnActive: string; iconBg: string; iconColor: string; ring: string; routeBg: string; routeText: string }> = {
    b1: { btn: 'text-slate-600 border-slate-200 hover:border-blue-300', btnActive: 'bg-blue-600 text-white border-blue-600 shadow-md', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', ring: 'border-blue-300 ring-2 ring-blue-200', routeBg: 'bg-blue-50', routeText: 'text-blue-700' },
    b2: { btn: 'text-slate-600 border-slate-200 hover:border-emerald-300', btnActive: 'bg-emerald-600 text-white border-emerald-600 shadow-md', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', ring: 'border-emerald-300 ring-2 ring-emerald-200', routeBg: 'bg-emerald-50', routeText: 'text-emerald-700' },
    b3: { btn: 'text-slate-600 border-slate-200 hover:border-amber-300', btnActive: 'bg-amber-500 text-white border-amber-500 shadow-md', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', ring: 'border-amber-300 ring-2 ring-amber-200', routeBg: 'bg-amber-50', routeText: 'text-amber-700' },
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Navigation className="w-6 h-6" />
          <span className="font-bold text-xl">Live GPS Tracking</span>
        </div>
        <p className="text-blue-200 text-sm">Real-time bus tracking across all active routes. Updated every 5 seconds.</p>
        <div className="flex items-center gap-2 mt-3">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
          <span className="text-sm font-semibold text-green-300">3 Buses Active · All On Route</span>
        </div>
      </div>

      {/* Bus Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setSelectedBus(null)}
          className={`py-2.5 px-4 rounded-xl text-sm font-semibold transition-all border-2
            ${!selectedBus ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
        >
          All Buses
        </button>
        {buses.map(bus => {
          const c = busClasses[bus.id];
          const isSelected = selectedBus === bus.id;
          return (
            <button
              key={bus.id}
              onClick={() => setSelectedBus(bus.id === selectedBus ? null : bus.id)}
              className={`py-2.5 px-3 rounded-xl text-sm font-semibold transition-all border-2
                ${isSelected ? c.btnActive : `bg-white ${c.btn}`}`}
            >
              🚌 {bus.id.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Live Map */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-slate-800">
              {selectedBus ? `Tracking: ${buses.find(b => b.id === selectedBus)?.busNumber}` : 'All Routes - Live View'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block"></span>
            Auto-refresh every 5s
          </div>
        </div>
        <div className="p-4">
          <LiveMap
            showAllBuses={!selectedBus}
            highlightBusId={selectedBus ?? undefined}
            selectedRouteId={selectedBus ? routes.find(r => r.busId === selectedBus)?.id : undefined}
            height={400}
          />
        </div>
      </div>

      {/* Bus Detail Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {buses.map(bus => {
          const { route, driver, busStudents, onBoard } = getBusData(bus.id);
          const c = busClasses[bus.id];
          const isActive = !selectedBus || selectedBus === bus.id;
          return (
            <motion.div
              key={bus.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isActive ? 1 : 0.5, y: 0 }}
              className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer transition-all hover:shadow-md
                ${selectedBus === bus.id ? c.ring : 'border-slate-100'}`}
              onClick={() => setSelectedBus(bus.id === selectedBus ? null : bus.id)}
            >
              {/* Bus header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl ${c.iconBg} flex items-center justify-center`}>
                  <Bus className={`w-6 h-6 ${c.iconColor}`} />
                </div>
                <div>
                  <div className="font-bold text-slate-800">{bus.busNumber}</div>
                  <div className="text-xs text-slate-500">{bus.model} · {bus.year}</div>
                </div>
                <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                  Active
                </span>
              </div>

              {/* Route */}
              {route && (
                <div className={`${c.routeBg} rounded-xl p-3 mb-3`}>
                  <div className="text-xs font-semibold text-slate-600 mb-1">📍 Route</div>
                  <div className={`text-sm font-bold ${c.routeText}`}>{route.name}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {route.stops.length} stops · {route.distance} km · ~{route.estimatedTime} min
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="text-center bg-slate-50 rounded-xl p-2">
                  <div className="text-slate-800 font-bold">{onBoard}</div>
                  <div className="text-xs text-slate-400">On Board</div>
                </div>
                <div className="text-center bg-slate-50 rounded-xl p-2">
                  <div className="text-slate-800 font-bold">{bus.speed}</div>
                  <div className="text-xs text-slate-400">km/h</div>
                </div>
                <div className="text-center bg-slate-50 rounded-xl p-2">
                  <div className="text-slate-800 font-bold">{bus.fuel}%</div>
                  <div className="text-xs text-slate-400">Fuel</div>
                </div>
              </div>

              {/* Fuel bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Fuel Level</span>
                  <span className={`font-semibold ${bus.fuel < 20 ? 'text-red-500' : 'text-emerald-600'}`}>{bus.fuel}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${bus.fuel < 20 ? 'bg-red-500' : bus.fuel < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${bus.fuel}%` }}
                  />
                </div>
              </div>

              {/* Driver */}
              {driver && (
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: driver.color }}
                  >
                    {driver.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-700 truncate">{driver.name}</div>
                    <div className="text-xs text-slate-400">{driver.phone}</div>
                  </div>
                  <a href={`tel:${driver.phone}`} className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100">
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Student pills */}
              <div className="flex flex-wrap gap-1 mt-3">
                {busStudents.slice(0, 4).map(s => (
                  <span
                    key={s.id}
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      s.status === 'in' ? 'bg-emerald-100 text-emerald-700' :
                      s.status === 'out' ? 'bg-blue-100 text-blue-700' :
                      s.status === 'absent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {s.name.split(' ')[0]}
                  </span>
                ))}
                {busStudents.length > 4 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">+{busStudents.length - 4}</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Route Details */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          Route Stop Details
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {routes.map(route => (
            <div key={route.id}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full" style={{ background: route.color }}></span>
                <span className="font-semibold text-slate-700 text-sm">{route.name}</span>
              </div>
              <div className="space-y-2">
                {route.stops.map((stop, i) => (
                  <div key={stop.id} className="flex items-center gap-2 text-xs">
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full border-2 flex-shrink-0" style={{ borderColor: route.color, background: i === route.stops.length - 1 ? route.color : 'white' }} />
                      {i < route.stops.length - 1 && <div className="w-0.5 h-4 my-0.5" style={{ background: route.color, opacity: 0.3 }} />}
                    </div>
                    <div className="flex-1">
                      <span className="text-slate-700 font-medium">{stop.name}</span>
                      <span className="text-slate-400 ml-1">{stop.time}</span>
                    </div>
                    <span className="text-slate-400">{stop.studentIds.length} 👤</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}