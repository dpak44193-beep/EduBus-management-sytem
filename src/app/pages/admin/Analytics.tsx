import { motion } from 'motion/react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Users, Bus, Route, Clock, Award } from 'lucide-react';
import {
  weeklyAttendance, monthlyTrend, busOccupancy, routePerformance,
  students, drivers, buses, routes
} from '../../data/mockData';

const gradeData = [
  { grade: '8th', students: 2, present: 1 },
  { grade: '9th', students: 2, present: 2 },
  { grade: '10th', students: 2, present: 2 },
  { grade: '11th', students: 2, present: 2 },
  { grade: '12th', students: 2, present: 2 },
];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const ChartCard = ({ title, subtitle, icon: Icon, children }: { title: string; subtitle?: string; icon: React.ElementType; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
  >
    <div className="flex items-center gap-2 mb-1">
      <Icon className="w-4 h-4 text-blue-500" />
      <span className="font-bold text-slate-800 text-sm">{title}</span>
    </div>
    {subtitle && <p className="text-xs text-slate-400 mb-4">{subtitle}</p>}
    {!subtitle && <div className="mb-4" />}
    {children}
  </motion.div>
);

export function Analytics() {
  const presentToday = students.filter(s => s.status === 'in' || s.status === 'out').length;
  const attendancePct = Math.round((presentToday / students.length) * 100);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-6 h-6" />
          <span className="font-bold text-xl">Analytics & Reports</span>
        </div>
        <p className="text-amber-100 text-sm">Comprehensive data insights for your school bus management system.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Students', value: students.length, sub: 'Registered', bg: 'bg-blue-50', border: 'border-blue-100', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', textColor: 'text-blue-700', subColor: 'text-blue-600' },
          { icon: Bus, label: 'Active Buses', value: buses.filter(b => b.status === 'active').length, sub: 'Currently', bg: 'bg-emerald-50', border: 'border-emerald-100', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', textColor: 'text-emerald-700', subColor: 'text-emerald-600' },
          { icon: TrendingUp, label: "Today's Attendance", value: `${attendancePct}%`, sub: `${presentToday}/${students.length} present`, bg: 'bg-violet-50', border: 'border-violet-100', iconBg: 'bg-violet-100', iconColor: 'text-violet-600', textColor: 'text-violet-700', subColor: 'text-violet-600' },
          { icon: Clock, label: 'Avg. Pickup Time', value: '07:49 AM', sub: 'Morning average', bg: 'bg-amber-50', border: 'border-amber-100', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', textColor: 'text-amber-700', subColor: 'text-amber-600' },
        ].map(kpi => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className={`${kpi.bg} border ${kpi.border} rounded-2xl p-4`}>
              <div className={`w-10 h-10 ${kpi.iconBg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${kpi.iconColor}`} />
              </div>
              <div className={`text-2xl font-extrabold ${kpi.textColor}`}>{kpi.value}</div>
              <div className={`text-xs font-semibold ${kpi.subColor} mt-0.5`}>{kpi.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{kpi.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Row 1 */}
      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Weekly Attendance Trend" subtitle="Last 7 days overview" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyAttendance}>
              <defs>
                <linearGradient id="ag1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ag2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
              <Legend />
              <Area type="monotone" dataKey="present" name="Present" stroke="#22C55E" fill="url(#ag1)" strokeWidth={2} />
              <Area type="monotone" dataKey="absent" name="Absent" stroke="#EF4444" fill="url(#ag2)" strokeWidth={2} />
              <Area type="monotone" dataKey="late" name="Late" stroke="#F59E0B" fill="none" strokeWidth={2} strokeDasharray="5 3" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Bus Occupancy Distribution" subtitle="Students per bus today" icon={Bus}>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie
                  data={busOccupancy}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {busOccupancy.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {busOccupancy.map(item => (
                <div key={item.name}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }}></span>
                    <span className="text-xs text-slate-600 truncate">{item.name}</span>
                  </div>
                  <div className="text-xs font-bold" style={{ color: item.color }}>
                    {item.value} students
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Row 2 */}
      <div className="grid lg:grid-cols-2 gap-5">
        <ChartCard title="Route Performance" subtitle="On-time vs delayed pickups (this month)" icon={Route}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={routePerformance} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="route" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
              <Legend />
              <Bar dataKey="onTime" name="On Time" fill="#22C55E" radius={[4,4,0,0]} />
              <Bar dataKey="delayed" name="Delayed" fill="#F59E0B" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Attendance Trend" subtitle="Average attendance % per month" icon={TrendingUp}>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
              <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} tickFormatter={v => `${v}%`} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', fontSize: '12px' }}
                formatter={(v: number) => [`${v}%`, 'Attendance']}
              />
              <Line
                type="monotone"
                dataKey="attendance"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: '#3B82F6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Grade-wise */}
      <ChartCard title="Grade-wise Attendance Distribution" subtitle="Students present by grade today" icon={Award}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={gradeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="grade" tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
            <Legend />
            <Bar dataKey="students" name="Total Students" fill="#BFDBFE" radius={[4,4,0,0]} />
            <Bar dataKey="present" name="Present Today" fill="#3B82F6" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Driver Performance */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-slate-800 text-sm">Driver Performance Ratings</span>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {drivers.map(d => {
            const routeInfo = routes.find(r => r.driverId === d.id);
            return (
              <div key={d.id} className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: d.color }}>
                  {d.initials}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 text-sm">{d.name}</div>
                  <div className="text-xs text-slate-500">{routeInfo?.name.split('–')[0].trim()}</div>
                  <div className="flex items-center gap-1 mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className={`h-2 rounded-full flex-1 ${i < Math.floor(d.rating) ? '' : 'opacity-20'}`} style={{ background: d.color }} />
                    ))}
                  </div>
                  <div className="text-xs font-bold mt-1" style={{ color: d.color }}>
                    {d.rating}/5.0 Rating · {d.experience}yrs exp.
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}