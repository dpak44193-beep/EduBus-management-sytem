import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit2, Trash2, X, Phone, Star, AlertTriangle, CheckCircle, Search, Car } from 'lucide-react';
import { drivers as initialDrivers, Driver, buses, emergencyAlerts } from '../../data/mockData';

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

const statusConfig: Record<string, { label: string; color: string }> = {
  'on-route': { label: '🟢 On Route', color: 'bg-emerald-100 text-emerald-700' },
  'active': { label: '🔵 Active', color: 'bg-blue-100 text-blue-700' },
  'inactive': { label: '⚪ Inactive', color: 'bg-slate-100 text-slate-600' },
};

const emptyForm = {
  name: '', phone: '', email: '', address: '', busId: 'b1', license: '', experience: 0,
};

export function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const filtered = drivers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.phone.includes(search) ||
    d.license.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (d: Driver) => {
    setEditId(d.id);
    setForm({
      name: d.name, phone: d.phone, email: d.email,
      address: d.address, busId: d.busId, license: d.license, experience: d.experience,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.phone) return;
    if (editId) {
      setDrivers(prev => prev.map(d => d.id === editId ? { ...d, ...form, initials: getInitials(form.name) } : d));
    } else {
      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
      const newD: Driver = {
        id: `d${Date.now()}`,
        ...form,
        status: 'active',
        initials: getInitials(form.name),
        color: colors[drivers.length % colors.length],
        rating: 4.5,
      };
      setDrivers(prev => [...prev, newD]);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); }, 800);
  };

  const unresolvedAlerts = emergencyAlerts.filter(e => !e.resolved);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <div className="text-slate-800 font-bold text-lg">Driver Management</div>
          <div className="text-slate-500 text-sm">{drivers.length} drivers registered</div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Driver
        </button>
      </div>

      {/* Emergency Alerts */}
      {unresolvedAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="font-bold text-red-700">Emergency Alerts ({unresolvedAlerts.length} Unresolved)</span>
          </div>
          {unresolvedAlerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-3 bg-white border border-red-100 rounded-xl p-3 mb-2">
              <span className="text-xl">🚨</span>
              <div className="flex-1">
                <div className="font-semibold text-slate-800 text-sm">{alert.driverName} – {buses.find(b => b.id === alert.busId)?.busNumber}</div>
                <div className="text-slate-600 text-sm mt-0.5">{alert.message}</div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-slate-400">📍 {alert.location}</span>
                  <span className="text-xs text-slate-400">⏰ {alert.timestamp}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${drivers.find(d => d.id === alert.driverId)?.phone}`}
                  className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                  <Phone className="w-3.5 h-3.5" />
                </a>
                <button className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-semibold hover:bg-emerald-200">
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
        <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 max-w-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search drivers..."
            className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(d => {
          const assignedBus = buses.find(b => b.id === d.busId);
          const status = statusConfig[d.status] ?? statusConfig['inactive'];
          const hasAlert = emergencyAlerts.some(e => e.driverId === d.id && !e.resolved);
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition-shadow ${hasAlert ? 'border-red-200' : 'border-slate-100'}`}
            >
              {hasAlert && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1.5 rounded-xl mb-3">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Emergency Alert!
                </div>
              )}
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                  style={{ background: d.color }}
                >
                  {d.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800">{d.name}</div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                    {status.label}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < Math.floor(d.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                    ))}
                    <span className="text-xs text-slate-500 ml-0.5">{d.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { icon: '📞', label: d.phone },
                  { icon: '✉️', label: d.email },
                  { icon: '🪪', label: `License: ${d.license}` },
                  { icon: '⏱️', label: `${d.experience} years experience` },
                  { icon: '🚌', label: assignedBus ? `${assignedBus.busNumber} (${assignedBus.model})` : 'No bus assigned' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => openEdit(d)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
                <a
                  href={`tel:${d.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Call
                </a>
                <button
                  onClick={() => setDeleteId(d.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">{editId ? 'Edit Driver' : 'Add New Driver'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Full Name', placeholder: "Driver's name" },
                    { key: 'phone', label: 'Phone', placeholder: '9876543210' },
                    { key: 'email', label: 'Email', placeholder: 'driver@bus.com' },
                    { key: 'license', label: 'License No.', placeholder: 'TN01-20231001' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                      <input
                        value={(form as any)[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Experience (yrs)</label>
                    <input
                      type="number"
                      value={form.experience}
                      onChange={e => setForm(p => ({ ...p, experience: +e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Assign Bus</label>
                    <select
                      value={form.busId}
                      onChange={e => setForm(p => ({ ...p, busId: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 bg-white"
                    >
                      {buses.map(b => <option key={b.id} value={b.id}>{b.busNumber}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Address</label>
                  <input
                    value={form.address}
                    onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                    placeholder="Full address"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
              <div className="px-6 pb-6 flex gap-3 justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : editId ? 'Save Changes' : 'Add Driver'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center"
            >
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-1">Remove Driver?</h3>
              <p className="text-slate-500 text-sm mb-5">This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteId(null)} className="px-5 py-2 rounded-xl border border-slate-200 text-sm">Cancel</button>
                <button onClick={() => { setDrivers(p => p.filter(d => d.id !== deleteId)); setDeleteId(null); }} className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold">
                  Remove
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
