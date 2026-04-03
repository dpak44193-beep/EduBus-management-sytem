import { useState } from 'react';
import { motion } from 'motion/react';
import { ClipboardList, Download, Filter, CheckCircle2, XCircle, Clock, Search } from 'lucide-react';
import { attendanceRecords, students, buses } from '../../data/mockData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const weeklyData = [
  { day: 'Mon', present: 9, absent: 1, late: 0 },
  { day: 'Tue', present: 8, absent: 1, late: 1 },
  { day: 'Wed', present: 10, absent: 0, late: 0 },
  { day: 'Thu', present: 7, absent: 2, late: 1 },
  { day: 'Fri', present: 9, absent: 1, late: 0 },
  { day: 'Sat', present: 6, absent: 4, late: 0 },
  { day: 'Today', present: 8, absent: 2, late: 0 },
];

export function Attendance() {
  const [date, setDate] = useState('2026-04-02');
  const [busFilter, setBusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'today' | 'weekly'>('today');

  const todayRecords = attendanceRecords.filter(r => r.date === date);

  const enriched = todayRecords
    .map(r => ({
      ...r,
      student: students.find(s => s.id === r.studentId),
    }))
    .filter(r => r.student)
    .filter(r => busFilter === 'all' || r.busId === busFilter)
    .filter(r => r.student!.name.toLowerCase().includes(search.toLowerCase()) ||
      r.student!.rollNumber.toLowerCase().includes(search.toLowerCase()));

  const present = enriched.filter(r => r.status === 'present').length;
  const absent = enriched.filter(r => r.status === 'absent').length;
  const late = enriched.filter(r => r.status === 'late').length;
  const total = enriched.length;
  const attendancePct = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-6 h-6" />
          <span className="font-bold text-xl">Attendance Management</span>
        </div>
        <p className="text-violet-200 text-sm">Daily pickup & drop records for all students.</p>
        <div className="flex flex-wrap gap-4 mt-3">
          <div className="text-center">
            <div className="text-2xl font-extrabold">{attendancePct}%</div>
            <div className="text-violet-200 text-xs">Attendance Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-green-300">{present}</div>
            <div className="text-violet-200 text-xs">Present</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-red-300">{absent}</div>
            <div className="text-violet-200 text-xs">Absent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-amber-300">{late}</div>
            <div className="text-violet-200 text-xs">Late</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-xl border border-slate-100 shadow-sm p-1 w-fit">
        {[
          { key: 'today', label: "Today's Attendance" },
          { key: 'weekly', label: 'Weekly Overview' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t.key ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'today' ? (
        <>
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
            <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-40">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search student..."
                className="bg-transparent text-sm outline-none w-full placeholder:text-slate-400"
              />
            </div>
            <select
              value={busFilter}
              onChange={e => setBusFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none bg-white"
            >
              <option value="all">All Buses</option>
              {buses.map(b => <option key={b.id} value={b.id}>{b.busNumber}</option>)}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    {['Student', 'Roll No', 'Bus', 'Pickup Time', 'Drop Time', 'Status', 'Attendance %'].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {enriched.map(r => {
                    const s = r.student!;
                    // Calculate attendance % from all records
                    const allForStudent = attendanceRecords.filter(a => a.studentId === s.id);
                    const presentCount = allForStudent.filter(a => a.status === 'present' || a.status === 'late').length;
                    const pct = allForStudent.length > 0 ? Math.round((presentCount / allForStudent.length) * 100) : 0;

                    return (
                      <motion.tr
                        key={r.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: s.color }}>
                              {s.initials}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-700">{s.name}</div>
                              <div className="text-xs text-slate-400">{s.grade}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-mono text-slate-600">{s.rollNumber}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{r.busId.toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            {r.inTime !== '--' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-700 font-medium">{r.inTime}</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5 text-red-400" />
                                <span className="text-red-500">--</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            {r.outTime !== '--' ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                                <span className="text-blue-700 font-medium">{r.outTime}</span>
                              </>
                            ) : (
                              <span className="text-slate-400 text-sm">--</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            r.status === 'present' ? 'bg-emerald-100 text-emerald-700' :
                            r.status === 'absent' ? 'bg-red-100 text-red-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {r.status === 'present' ? '✓ Present' : r.status === 'absent' ? '✗ Absent' : '⚠ Late'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-100 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${pct >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className={`text-xs font-semibold ${pct >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>{pct}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              {enriched.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <ClipboardList className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  No attendance records found
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Weekly Chart */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="font-bold text-slate-800 mb-4">Weekly Attendance Overview</div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
              />
              <Legend />
              <Bar dataKey="present" name="Present" fill="#22C55E" radius={[4,4,0,0]} />
              <Bar dataKey="absent" name="Absent" fill="#EF4444" radius={[4,4,0,0]} />
              <Bar dataKey="late" name="Late" fill="#F59E0B" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>

          {/* Per-student summary */}
          <div className="mt-6">
            <div className="font-semibold text-slate-700 text-sm mb-3">Student Summary (All Time)</div>
            <div className="grid sm:grid-cols-2 gap-2">
              {students.map(s => {
                const allRec = attendanceRecords.filter(r => r.studentId === s.id);
                const pCount = allRec.filter(r => r.status !== 'absent').length;
                const pct = allRec.length > 0 ? Math.round((pCount / allRec.length) * 100) : 100;
                return (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: s.color }}>
                      {s.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-700 truncate">{s.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${pct >= 75 ? 'bg-emerald-500' : 'bg-red-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-xs font-bold flex-shrink-0 ${pct >= 75 ? 'text-emerald-600' : 'text-red-600'}`}>{pct}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
