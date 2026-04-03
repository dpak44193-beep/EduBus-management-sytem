import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Edit2, Trash2, X, Bus, MapPin, Phone, User, CheckCircle } from 'lucide-react';
import { students as initialStudents, Student, buses } from '../../data/mockData';

const statusColors: Record<string, string> = {
  in: 'bg-emerald-100 text-emerald-700',
  out: 'bg-blue-100 text-blue-700',
  absent: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
};

const avatarColors = ['#3B82F6','#EC4899','#8B5CF6','#F59E0B','#10B981','#EF4444','#06B6D4','#F97316','#84CC16','#A855F7'];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase();
}

const emptyForm = {
  name: '', rollNumber: '', email: '', parentName: '',
  phone: '', address: '', pickupPoint: '', busId: 'b1', grade: '',
};

export function Students() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [search, setSearch] = useState('');
  const [busFilter, setBusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    return (
      (s.name.toLowerCase().includes(q) || s.rollNumber.toLowerCase().includes(q) || s.grade.toLowerCase().includes(q)) &&
      (busFilter === 'all' || s.busId === busFilter)
    );
  });

  const openAdd = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setShowModal(true);
  };

  const openEdit = (s: Student) => {
    setEditId(s.id);
    setForm({
      name: s.name, rollNumber: s.rollNumber, email: s.email,
      parentName: s.parentName, phone: s.phone, address: s.address,
      pickupPoint: s.pickupPoint, busId: s.busId, grade: s.grade,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.rollNumber) return;
    if (editId) {
      setStudents(prev => prev.map(s => s.id === editId ? {
        ...s, ...form, initials: getInitials(form.name),
      } : s));
    } else {
      const newS: Student = {
        id: `s${Date.now()}`,
        ...form,
        status: 'pending',
        lastPickup: '--',
        lastDrop: '--',
        parentId: `p${Date.now()}`,
        initials: getInitials(form.name),
        color: avatarColors[students.length % avatarColors.length],
      };
      setStudents(prev => [...prev, newS]);
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); setShowModal(false); }, 800);
  };

  const handleDelete = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <div className="text-slate-800 font-bold text-lg">Student Management</div>
          <div className="text-slate-500 text-sm">{students.length} students registered</div>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, roll number, grade..."
            className="bg-transparent text-sm text-slate-700 outline-none w-full placeholder:text-slate-400"
          />
        </div>
        <select
          value={busFilter}
          onChange={e => setBusFilter(e.target.value)}
          className="border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none bg-white"
        >
          <option value="all">All Buses</option>
          {buses.map(b => (
            <option key={b.id} value={b.id}>{b.busNumber}</option>
          ))}
        </select>
        <div className="flex gap-2 text-sm">
          {['all','in','out','absent'].map(s => (
            <span key={s} className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 font-medium cursor-pointer hover:bg-slate-200 transition-colors capitalize">
              {s === 'all' ? 'All' : s === 'in' ? '✓ On Bus' : s === 'out' ? '⬇ Dropped' : '✗ Absent'}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: students.length, bg: 'bg-blue-50', border: 'border-blue-100', textVal: 'text-blue-700', textLbl: 'text-blue-600' },
          { label: 'On Bus', value: students.filter(s => s.status === 'in').length, bg: 'bg-emerald-50', border: 'border-emerald-100', textVal: 'text-emerald-700', textLbl: 'text-emerald-600' },
          { label: 'Dropped', value: students.filter(s => s.status === 'out').length, bg: 'bg-violet-50', border: 'border-violet-100', textVal: 'text-violet-700', textLbl: 'text-violet-600' },
          { label: 'Absent', value: students.filter(s => s.status === 'absent').length, bg: 'bg-red-50', border: 'border-red-100', textVal: 'text-red-700', textLbl: 'text-red-600' },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-xl p-3 text-center`}>
            <div className={`${stat.textVal} font-extrabold text-xl`}>{stat.value}</div>
            <div className={`${stat.textLbl} text-xs font-medium`}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Student', 'Roll No', 'Grade', 'Bus', 'Pickup Point', 'Parent', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(s => (
                <motion.tr
                  key={s.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: s.color }}>
                        {s.initials}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-700">{s.name}</div>
                        <div className="text-xs text-slate-400">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600 font-mono">{s.rollNumber}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-semibold">{s.grade}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">{s.busId.toUpperCase()}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 max-w-[120px] truncate">{s.pickupPoint}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-slate-700">{s.parentName}</div>
                    <div className="text-xs text-slate-400">{s.phone}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[s.status]}`}>
                      {s.status === 'in' ? '✓ On Bus' : s.status === 'out' ? '⬇ Dropped' : s.status === 'absent' ? '✗ Absent' : '⏳ Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(s.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <User className="w-10 h-10 mx-auto mb-2 opacity-30" />
              No students found
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800">{editId ? 'Edit Student' : 'Add New Student'}</h3>
                <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Full Name', icon: User, placeholder: 'e.g. Arun Kumar' },
                    { key: 'rollNumber', label: 'Roll Number', icon: CheckCircle, placeholder: 'e.g. R011' },
                    { key: 'email', label: 'Email', icon: User, placeholder: 'student@school.com' },
                    { key: 'grade', label: 'Grade / Class', icon: User, placeholder: 'e.g. 10A' },
                    { key: 'parentName', label: 'Parent Name', icon: User, placeholder: "Parent's full name" },
                    { key: 'phone', label: 'Phone', icon: Phone, placeholder: '9812345678' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{f.label}</label>
                      <input
                        value={(form as any)[f.key]}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Address</label>
                  <input
                    value={form.address}
                    onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                    placeholder="Full address"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Pickup Point</label>
                    <input
                      value={form.pickupPoint}
                      onChange={e => setForm(p => ({ ...p, pickupPoint: e.target.value }))}
                      placeholder="Stop name"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Assign Bus</label>
                    <select
                      value={form.busId}
                      onChange={e => setForm(p => ({ ...p, busId: e.target.value }))}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"
                    >
                      {buses.map(b => (
                        <option key={b.id} value={b.id}>{b.busNumber}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 flex gap-3 justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : editId ? 'Save Changes' : 'Add Student'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
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
              <h3 className="font-bold text-slate-800 text-lg mb-1">Delete Student?</h3>
              <p className="text-slate-500 text-sm mb-5">This action cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setDeleteId(null)} className="px-5 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteId)} className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold">
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}