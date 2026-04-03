import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Bus, Shield, Car, BookOpen, User, Eye, EyeOff, AlertCircle } from 'lucide-react';


const roles = [
  { id: 'admin', label: 'Admin', icon: Shield, color: 'blue', demo: { email: 'admin', pass: 'admin123' }, desc: 'Full system control' },
  { id: 'driver', label: 'Driver', icon: Car, color: 'emerald', demo: { email: 'driver1', pass: 'driver123' }, desc: 'Route & tracking' },
  { id: 'student', label: 'Student', icon: BookOpen, color: 'violet', demo: { email: 'student1', pass: 'student123' }, desc: 'Bus status & history' },
  { id: 'parent', label: 'Parent', icon: User, color: 'orange', demo: { email: 'parent1', pass: 'parent123' }, desc: 'Track your child' },
];

const colorMap: Record<string, { bg: string; border: string; text: string; ring: string; btn: string }> = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    ring: 'ring-blue-500',
    btn: 'bg-blue-600 hover:bg-blue-700',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    ring: 'ring-emerald-500',
    btn: 'bg-emerald-600 hover:bg-emerald-700',
  },
  violet: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    ring: 'ring-violet-500',
    btn: 'bg-violet-600 hover:bg-violet-700',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    ring: 'ring-orange-500',
    btn: 'bg-orange-600 hover:bg-orange-700',
  },
};

const redirectMap: Record<string, string> = {
  admin: '/admin',
  driver: '/driver',
  student: '/student',
  parent: '/parent',
};

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const role = roles.find(r => r.id === selectedRole)!;
  const colors = colorMap[role.color];

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    const r = roles.find(r => r.id === roleId)!;
    setEmail(r.demo.email);
    setPassword(r.demo.pass);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(redirectMap[selectedRole]);
    } else {
      setError(result.error ?? 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative overflow-hidden p-12">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1595381340654-0c76e22190a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBidXMlMjBjaXR5JTIwcm9hZCUyMHRyYW5zcG9ydGF0aW9ufGVufDF8fHx8MTc3NTE0MjA3Mnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Bus"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 to-slate-900/80" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Bus className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-white font-extrabold text-2xl">BusTrack</div>
              <div className="text-blue-300 text-sm">School Bus Management</div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-white text-4xl font-extrabold leading-tight mb-6">
              Smart School<br />Transportation<br />
              <span className="text-blue-400">Management</span>
            </h2>
            <p className="text-slate-300 text-base leading-relaxed max-w-sm">
              Real-time GPS tracking, digital attendance, instant notifications, and complete transparency for schools, drivers, students & parents.
            </p>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 grid grid-cols-3 gap-4"
        >
          {[
            { label: 'Students', value: '10+', icon: '👨‍🎓' },
            { label: 'Active Buses', value: '3', icon: '🚌' },
            { label: 'Routes', value: '3', icon: '🗺️' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-white font-bold text-xl">{stat.value}</div>
              <div className="text-white/60 text-xs">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden justify-center">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-xl">BusTrack</span>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8">
              <h3 className="text-slate-800 font-bold text-2xl mb-1">Welcome Back</h3>
              <p className="text-slate-500 text-sm mb-6">Select your role and sign in to continue</p>

              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {roles.map(r => {
                  const Icon = r.icon;
                  const c = colorMap[r.color];
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRoleSelect(r.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 transition-all text-left
                        ${isSelected
                          ? `${c.bg} ${c.border} ${c.text} ring-2 ${c.ring} ring-offset-1 shadow-sm`
                          : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold">{r.label}</div>
                        <div className="text-xs opacity-70">{r.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Demo Credentials Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5 flex items-center gap-2">
                <span className="text-lg">💡</span>
                <div className="text-xs text-slate-600">
                  <span className="font-semibold">Demo – {role.label}:</span>{' '}
                  <code className="bg-slate-200 px-1 rounded">{role.demo.email}</code> /{' '}
                  <code className="bg-slate-200 px-1 rounded">{role.demo.pass}</code>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Username / Email
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                    placeholder="Enter username"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all pr-10"
                      placeholder="Enter password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95 mt-2
                    ${colors.btn} disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : `Sign in as ${role.label}`}
                </button>
              </form>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-8 py-4 flex items-center justify-between">
              <span className="text-xs text-slate-400">🔒 Secured with JWT Auth</span>
              <span className="text-xs text-slate-400">BusTrack v2.0</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
