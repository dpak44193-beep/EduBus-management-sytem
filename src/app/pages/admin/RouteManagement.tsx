import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, X, MapPin, Clock, Users, Bus, Route as RouteIcon, CheckCircle } from 'lucide-react';
import { routes as initialRoutes, Route, buses, drivers, students } from '../../data/mockData';

export function RouteManagement() {
  const [routes, setRoutes] = useState<Route[]>(initialRoutes);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(routes[0]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const openAdd = () => {
    setEditId(null);
    setShowModal(true);
  };

  const totalStudentsOnRoute = (route: Route) =>
    students.filter(s => s.busId === route.busId).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <div className="text-slate-800 font-bold text-lg">Route Management</div>
          <div className="text-slate-500 text-sm">{routes.length} routes configured</div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          New Route
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Route List */}
        <div className="space-y-3">
          {routes.map(route => {
            const bus = buses.find(b => b.id === route.busId);
            const driver = drivers.find(d => d.id === route.driverId);
            const stCount = totalStudentsOnRoute(route);
            const isSelected = selectedRoute?.id === route.id;
            return (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedRoute(route)}
                className={`bg-white rounded-2xl border shadow-sm p-4 cursor-pointer hover:shadow-md transition-all
                  ${isSelected ? 'border-2 shadow-md' : 'border-slate-100'}`}
                style={isSelected ? { borderColor: route.color } : {}}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: route.color }}></div>
                  <span className="font-bold text-slate-800 text-sm">{route.name}</span>
                  {isSelected && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold text-white" style={{ background: route.color }}>
                      Active
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center bg-slate-50 rounded-xl py-2">
                    <div className="font-bold text-slate-800 text-sm">{route.stops.length}</div>
                    <div className="text-xs text-slate-400">Stops</div>
                  </div>
                  <div className="text-center bg-slate-50 rounded-xl py-2">
                    <div className="font-bold text-slate-800 text-sm">{route.distance}km</div>
                    <div className="text-xs text-slate-400">Distance</div>
                  </div>
                  <div className="text-center bg-slate-50 rounded-xl py-2">
                    <div className="font-bold text-slate-800 text-sm">{stCount}</div>
                    <div className="text-xs text-slate-400">Students</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Bus className="w-3 h-3" />
                    <span>{bus?.busNumber ?? 'No bus'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Users className="w-3 h-3" />
                    <span>{driver?.name ?? 'No driver'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>AM: {route.morningStart} · PM: {route.afternoonStart}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={e => { e.stopPropagation(); setEditId(route.id); setShowModal(true); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setRoutes(p => p.filter(r => r.id !== route.id)); if (selectedRoute?.id === route.id) setSelectedRoute(null); }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Route Detail */}
        <div className="lg:col-span-2">
          {selectedRoute ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-5 py-4 border-b border-slate-100" style={{ background: `${selectedRoute.color}15` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: selectedRoute.color }}>
                    <RouteIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">{selectedRoute.name}</div>
                    <div className="text-xs text-slate-500">
                      {selectedRoute.distance} km · ~{selectedRoute.estimatedTime} min · {selectedRoute.stops.length} stops
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 border-b border-slate-100">
                {[
                  { label: 'Morning Depart', value: selectedRoute.morningStart, icon: '🌅' },
                  { label: 'Afternoon Depart', value: selectedRoute.afternoonStart, icon: '🌆' },
                  { label: 'Total Stops', value: `${selectedRoute.stops.length} stops`, icon: '📍' },
                  { label: 'Students', value: totalStudentsOnRoute(selectedRoute), icon: '👨‍🎓' },
                ].map(info => (
                  <div key={info.label} className="text-center bg-slate-50 rounded-xl p-3">
                    <div className="text-xl mb-1">{info.icon}</div>
                    <div className="font-bold text-slate-800 text-sm">{info.value}</div>
                    <div className="text-xs text-slate-400">{info.label}</div>
                  </div>
                ))}
              </div>

              {/* Stops Timeline */}
              <div className="p-5">
                <div className="font-semibold text-slate-700 text-sm mb-4">Stop Timeline</div>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-4 top-4 bottom-4 w-0.5 rounded-full" style={{ background: `${selectedRoute.color}40` }}></div>

                  <div className="space-y-4">
                    {selectedRoute.stops.map((stop, i) => {
                      const stopStudents = students.filter(s => stop.studentIds.includes(s.id));
                      const isLast = i === selectedRoute.stops.length - 1;
                      return (
                        <div key={stop.id} className="flex gap-4 relative">
                          {/* Stop marker */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold z-10 flex-shrink-0 ${isLast ? 'ring-2 ring-white' : ''}`}
                            style={{ background: selectedRoute.color }}
                          >
                            {isLast ? '🏫' : i + 1}
                          </div>
                          <div className={`flex-1 bg-slate-50 rounded-xl p-3 ${isLast ? 'border-2' : ''}`} style={isLast ? { borderColor: selectedRoute.color } : {}}>
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div>
                                <div className="font-semibold text-slate-700 text-sm">{stop.name}</div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span className="text-xs text-slate-500">{stop.time}</span>
                                  {isLast && <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full">Destination</span>}
                                </div>
                              </div>
                              {stopStudents.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {stopStudents.map(s => (
                                    <span key={s.id} className="text-xs px-2 py-0.5 rounded-full text-white font-medium" style={{ background: s.color }}>
                                      {s.name.split(' ')[0]}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Assigned resources */}
              <div className="px-5 pb-5">
                <div className="font-semibold text-slate-700 text-sm mb-3">Assigned Resources</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {/* Bus */}
                  {(() => {
                    const bus = buses.find(b => b.id === selectedRoute.busId);
                    if (!bus) return null;
                    return (
                      <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Bus className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Assigned Bus</div>
                          <div className="font-semibold text-slate-800 text-sm">{bus.busNumber}</div>
                          <div className="text-xs text-slate-400">{bus.model} · Capacity: {bus.capacity}</div>
                        </div>
                      </div>
                    );
                  })()}
                  {/* Driver */}
                  {(() => {
                    const driver = drivers.find(d => d.id === selectedRoute.driverId);
                    if (!driver) return null;
                    return (
                      <div className="flex items-center gap-3 bg-emerald-50 rounded-xl p-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: driver.color }}>
                          {driver.initials}
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Assigned Driver</div>
                          <div className="font-semibold text-slate-800 text-sm">{driver.name}</div>
                          <div className="text-xs text-slate-400">{driver.phone}</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center">
              <RouteIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <div className="text-slate-400">Select a route to view details</div>
            </div>
          )}
        </div>
      </div>

      {/* New Route Modal (simplified) */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">{editId ? 'Edit Route' : 'Create New Route'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-slate-400"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Route Name</label>
                  <input className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="e.g. Route D – West Zone" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Assign Bus</label>
                    <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white">
                      {buses.map(b => <option key={b.id} value={b.id}>{b.busNumber}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Assign Driver</label>
                    <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white">
                      {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Morning Start</label>
                    <input type="time" defaultValue="06:30" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Afternoon Start</label>
                    <input type="time" defaultValue="16:00" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Route Color</label>
                  <div className="flex gap-3">
                    {['#3B82F6','#10B981','#F59E0B','#8B5CF6','#EF4444','#F97316'].map(c => (
                      <button key={c} className="w-7 h-7 rounded-full ring-2 ring-offset-1 ring-transparent hover:ring-slate-400" style={{ background: c }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 flex gap-3 justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600">Cancel</button>
                <button
                  onClick={() => { setSaved(true); setTimeout(() => { setSaved(false); setShowModal(false); }, 800); }}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2"
                >
                  {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : editId ? 'Save Changes' : 'Create Route'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
