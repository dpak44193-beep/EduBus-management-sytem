import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { motion } from 'motion/react';
import { Bus, Shield, Car, BookOpen, User, Eye, EyeOff, AlertCircle, CheckCircle2, MapPinned } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { LiveMap } from '../components/map/LiveMap';

function RoleButton({
  label,
  selected,
  onClick,
  Icon,
  accent,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  Icon: React.ComponentType<{ className?: string }>;
  accent: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
        selected ? `${accent} border` : 'text-[#3E3E3E] hover:bg-white'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function DemoCredentials({ roleLabel, email, password }: { roleLabel: string; email: string; password: string }) {
  return (
    <div className="mb-6 rounded-xl border border-[#E8E8E8] bg-[#F9F7F4] p-3 text-sm text-[#3E3E3E]">
      <div className="flex items-center gap-2 font-medium">
        <CheckCircle2 className="h-4 w-4 text-[#06D6A0]" />
        Demo credentials for {roleLabel}
      </div>
      <div className="mt-2 font-mono text-xs text-[#3E3E3E]">
        {email} / {password}
      </div>
    </div>
  );
}

const roles = [
  { id: 'admin', label: 'Admin', icon: Shield, color: 'blue', demo: { email: import.meta.env.VITE_DEMO_ADMIN_EMAIL ?? '', pass: import.meta.env.VITE_DEMO_ADMIN_PASSWORD ?? '' }, desc: 'Full system control' },
  { id: 'driver', label: 'Driver', icon: Car, color: 'teal', demo: { email: import.meta.env.VITE_DEMO_DRIVER_EMAIL ?? '', pass: import.meta.env.VITE_DEMO_DRIVER_PASSWORD ?? '' }, desc: 'Route & tracking' },
  { id: 'student', label: 'Student', icon: BookOpen, color: 'blueSoft', demo: { email: import.meta.env.VITE_DEMO_STUDENT_EMAIL ?? '', pass: import.meta.env.VITE_DEMO_STUDENT_PASSWORD ?? '' }, desc: 'Bus status & history' },
  { id: 'parent', label: 'Parent', icon: User, color: 'orange', demo: { email: import.meta.env.VITE_DEMO_PARENT_EMAIL ?? '', pass: import.meta.env.VITE_DEMO_PARENT_PASSWORD ?? '' }, desc: 'Track your child' },
];

const colorMap: Record<string, { bg: string; border: string; text: string; ring: string; btn: string }> = {
  blue: {
    bg: 'bg-[#E3F2FD]',
    border: 'border-[#0F4C75]',
    text: 'text-[#0F4C75]',
    ring: 'ring-[#0F4C75]',
    btn: 'bg-[#0F4C75] hover:bg-[#0b3d5f]',
  },
  teal: {
    bg: 'bg-[#E6FFFB]',
    border: 'border-[#00A896]',
    text: 'text-[#00A896]',
    ring: 'ring-[#00A896]',
    btn: 'bg-[#00A896] hover:bg-[#008d7a]',
  },
  blueSoft: {
    bg: 'bg-[#EEF5FF]',
    border: 'border-[#3C7CBF]',
    text: 'text-[#3C7CBF]',
    ring: 'ring-[#3C7CBF]',
    btn: 'bg-[#3C7CBF] hover:bg-[#295d99]',
  },
  orange: {
    bg: 'bg-[#FFF3ED]',
    border: 'border-[#FF6B35]',
    text: 'text-[#FF6B35]',
    ring: 'ring-[#FF6B35]',
    btn: 'bg-[#FF6B35] hover:bg-[#e95a2d]',
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
  const [email, setEmail] = useState(roles[0].demo.email);
  const [password, setPassword] = useState(roles[0].demo.pass);
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
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate(redirectMap[selectedRole]);
    } else {
      setError(result.error ?? 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F9F7F4]">
      <div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-gradient-to-br from-[#0F4C75] via-[#0D3F62] to-[#00A896] p-12">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-16 right-8 h-52 w-52 rounded-full bg-[#00A896] blur-3xl" />
          <div className="absolute bottom-12 left-6 h-72 w-72 rounded-full bg-[#FF6B35] blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/12 shadow-lg backdrop-blur-sm ring-1 ring-white/20">
              <Bus className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Campus Transit</div>
              <div className="text-sm text-[#E3F2FD]">Education transport platform</div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="max-w-md">
            <h1 className="mb-4 text-5xl font-bold leading-tight text-white">
              Smart mobility for every campus journey.
            </h1>
            <p className="max-w-sm text-lg leading-relaxed text-[#E3F2FD]">
              Real-time bus tracking, attendance visibility, and secure route coordination for students, drivers, parents, and admins.
            </p>
          </motion.div>

          <div className="my-8 hidden lg:block">
            <LiveMap showAllBuses height={210} />
          </div>

          <div className="grid grid-cols-3 gap-4 text-white">
            {[
              { label: 'Students', value: '3,847', icon: '👨‍🎓' },
              { label: 'Buses', value: '24', icon: '🚌' },
              { label: 'Routes', value: '18', icon: '🗺️' },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/8 p-4 text-center backdrop-blur-sm">
                <div className="mb-2 text-2xl">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-[#E3F2FD]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10 lg:px-16">
        <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0F4C75] text-white shadow-md">
              <Bus className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0F4C75]">Campus Transit</div>
            </div>
          </div>

          <Card className="rounded-[28px] border-[#E8E8E8] bg-white p-7 shadow-[0_10px_30px_rgba(15,76,117,0.08)]">
            <div className="mb-7">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#00A896]">Welcome back</p>
              <h2 className="text-3xl font-bold text-[#1A1A1A]">Sign in to your account</h2>
            </div>

            <div className="mb-6 flex gap-2 rounded-xl bg-[#F5F5F5] p-1.5">
              {roles.map(r => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                const c = colorMap[r.color];

                return (
                  <RoleButton
                    key={r.id}
                    label={r.label}
                    selected={isSelected}
                    onClick={() => handleRoleSelect(r.id)}
                    Icon={Icon}
                    accent={`${c.bg} ${c.text} ${c.border}`}
                  />
                );
              })}
            </div>

            {role.demo.email && role.demo.pass && <DemoCredentials roleLabel={role.label} email={role.demo.email} password={role.demo.pass} />}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-[#1A1A1A]">
                  Email address
                </label>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@institution.edu"
                  className="h-12 rounded-xl border-2 border-[#E8E8E8] bg-white px-4 py-3 text-[#1A1A1A] outline-none transition-all placeholder:text-[#757575] focus:border-[#0F4C75] focus:shadow-focus"
                  required
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-semibold text-[#1A1A1A]">
                    Password
                  </label>
                  <button type="button" className="text-sm font-medium text-[#00A896] hover:text-[#0F4C75]">
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-12 rounded-xl border-2 border-[#E8E8E8] bg-white px-4 py-3 pr-11 text-[#1A1A1A] outline-none transition-all placeholder:text-[#757575] focus:border-[#0F4C75] focus:shadow-focus"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute inset-y-0 right-3 flex items-center text-[#757575] hover:text-[#0F4C75]"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-[#3E3E3E]">
                <input type="checkbox" id="remember" className="h-4 w-4 rounded border-[#0F4C75] text-[#0F4C75] focus:ring-[#0F4C75]" />
                <label htmlFor="remember">Keep me signed in</label>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-[#E63946]/20 bg-[#FFEBEE] px-3 py-2.5 text-sm text-[#E63946]">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl px-4 py-3.5 font-semibold text-white shadow-md transition-all hover:shadow-lg ${colors.btn} disabled:cursor-not-allowed disabled:opacity-75`}
              >
                {loading ? 'Signing in...' : `Sign in as ${role.label}`}
              </Button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-[#E8E8E8]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#757575]">or</span>
                <div className="h-px flex-1 bg-[#E8E8E8]" />
              </div>

              <div className="space-y-3">
                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#E8E8E8] bg-white px-4 py-3 font-semibold text-[#1A1A1A] transition-all hover:bg-[#F5F5F5]">
                  <MapPinned className="h-4 w-4 text-[#0F4C75]" />
                  Continue with Google
                </button>
                <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#E8E8E8] bg-white px-4 py-3 font-semibold text-[#1A1A1A] transition-all hover:bg-[#F5F5F5]">
                  <Shield className="h-4 w-4 text-[#00A896]" />
                  Continue with Microsoft
                </button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-[#3E3E3E]">
              Need access?{' '}
              <button type="button" className="font-semibold text-[#00A896] hover:text-[#0F4C75]">
                Request access
              </button>
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
