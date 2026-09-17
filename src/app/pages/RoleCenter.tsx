import { useMemo, useState } from 'react';
import { Bell, BellRing, CheckCircle2, KeyRound, LockKeyhole, Mail, Save, Settings, ShieldCheck, UserCircle, UserRound, X } from 'lucide-react';
import { useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { notifications } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';

const roleNames: Record<string, string> = { admin: 'Administrator', driver: 'Bus Driver', student: 'Student', parent: 'Parent' };
const roleFeatures: Record<string, string[]> = {
  admin: ['Manage students and drivers', 'Monitor the entire fleet live', 'Review attendance and route analytics', 'Resolve safety and emergency alerts'],
  driver: ['View assigned students and route', 'Track the assigned bus live', 'Record pickup and drop attendance', 'Receive delay and safety notifications'],
  student: ['View assigned bus and route', 'Check live bus location', 'Review personal attendance history', 'Receive pickup and delay alerts'],
  parent: ['Monitor your child\'s bus journey', 'View pickup and drop status', 'Review attendance history', 'Contact the assigned driver'],
};
const notificationIcons: Record<string, string> = { pickup: '●', drop: '●', alert: '!', delay: '◷', emergency: '!', info: 'i' };

export function RoleCenter() {
  const { currentUser, updateProfile } = useAuth();
  const location = useLocation();
  const role = currentUser?.role ?? 'admin';
  const page = location.pathname.split('/').pop() ?? 'profile';
  const [items, setItems] = useState(() => notifications.filter((item) => item.targetRoles.includes(role)));
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [name, setName] = useState(currentUser?.name ?? '');
  const [phone, setPhone] = useState(currentUser?.phone ?? '');
  const [preferences, setPreferences] = useState(() => {
    const stored = localStorage.getItem(`bms_preferences_${role}`);
    return stored ? JSON.parse(stored) : { delays: true, confirmations: true, emergencies: true, summary: false };
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const unreadCount = useMemo(() => items.filter((item) => !item.read).length, [items]);

  const markAllRead = () => setItems((previous) => previous.map((item) => ({ ...item, read: true })));
  const dismiss = (id: string) => setItems((previous) => previous.filter((item) => item.id !== id));
  const saveProfile = async () => {
    setProfileError('');
    const result = await updateProfile({ name, phone });
    if (!result.success) {
      setProfileError(result.error ?? 'Unable to update profile.');
      return;
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const savePreferences = (nextPreferences: typeof preferences) => {
    setPreferences(nextPreferences);
    localStorage.setItem(`bms_preferences_${role}`, JSON.stringify(nextPreferences));
  };

  const changePassword = async () => {
    setPasswordError('');
    setPasswordMessage('');
    const token = localStorage.getItem('bms_token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setPasswordError(data.error ?? 'Unable to change password.');
        return;
      }
      setCurrentPassword('');
      setNewPassword('');
      setPasswordMessage(data.message);
    } catch {
      setPasswordError('The API server is unavailable. Please try again.');
    }
  };

  if (page === 'notifications') {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
        <PageIntro icon={BellRing} eyebrow="Communication center" title="Notifications" description={`Stay current with ${roleNames[role].toLowerCase()} updates, safety alerts, and route events.`} />
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="text-sm text-slate-600"><strong className="text-slate-900">{unreadCount}</strong> unread updates for your account</div>
          {unreadCount > 0 && <Button variant="outline" size="sm" onClick={markAllRead}>Mark all as read</Button>}
        </div>
        <div className="space-y-3">
          {items.length === 0 ? <EmptyState title="You are all caught up" description="New route and safety updates will appear here." /> : items.map((item) => (
            <Card key={item.id} className={!item.read ? 'border-blue-200 bg-blue-50/40' : ''}>
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600">{notificationIcons[item.type]}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><span className="font-semibold capitalize text-slate-900">{item.type} update</span>{!item.read && <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">New</span>}</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.message}</p>
                  <p className="mt-2 text-xs text-slate-400">{item.timestamp}</p>
                </div>
                <button aria-label="Dismiss notification" onClick={() => dismiss(item.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X className="h-4 w-4" /></button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (page === 'settings') {
    return (
      <div className="mx-auto max-w-5xl space-y-5">
        <PageIntro icon={Settings} eyebrow="Account preferences" title="Settings" description="Control the alerts and security preferences for your Campus Transit account." />
        <div className="grid gap-5 lg:grid-cols-2">
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4 text-blue-600" />Notification preferences</CardTitle></CardHeader><CardContent className="space-y-4">{([['delays', 'Route delay alerts'], ['confirmations', 'Pickup and drop confirmations'], ['emergencies', 'Emergency safety alerts'], ['summary', 'Weekly attendance summary']] as const).map(([key, label]) => <label key={key} className="flex cursor-pointer items-center justify-between gap-4 text-sm text-slate-700"><span>{label}</span><input type="checkbox" checked={preferences[key]} onChange={(event) => savePreferences({ ...preferences, [key]: event.target.checked })} className="h-4 w-4 accent-blue-600" /></label>)}<p className="text-xs text-slate-400">Preferences are saved for this account on this device.</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-emerald-600" />Security</CardTitle></CardHeader><CardContent className="space-y-3"><button onClick={() => setShowPasswordForm((value) => !value)} className="flex w-full items-center gap-3 rounded-lg border border-slate-200 p-3 text-left text-sm text-slate-700 hover:bg-slate-50"><LockKeyhole className="h-4 w-4 text-slate-500" /><span><strong className="block text-slate-900">Change password</strong><span className="text-xs text-slate-500">Update your sign-in credentials</span></span></button>{showPasswordForm && <div className="space-y-3 rounded-lg bg-slate-50 p-3"><Input type="password" placeholder="Current password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /><Input type="password" placeholder="New password (8+ characters)" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /><Button size="sm" onClick={changePassword}><KeyRound className="h-4 w-4" />Update password</Button>{passwordError && <p className="text-xs text-red-600">{passwordError}</p>}{passwordMessage && <p className="text-xs text-emerald-600">{passwordMessage}</p>}</div>}<div className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700"><Mail className="h-4 w-4 text-slate-500" /><span><strong className="block text-slate-900">Current session</strong><span className="text-xs text-slate-500">Authenticated with an 8-hour access token</span></span></div></CardContent></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <PageIntro icon={UserCircle} eyebrow="Account center" title="My Profile" description="Keep your contact details current so the right people can reach you during a journey." />
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><UserRound className="h-4 w-4 text-blue-600" />Personal information</CardTitle></CardHeader><CardContent className="space-y-4"><div><label htmlFor="profile-name" className="mb-1.5 block text-sm font-medium text-slate-700">Full name</label><Input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} /></div><div><label htmlFor="profile-phone" className="mb-1.5 block text-sm font-medium text-slate-700">Phone number</label><Input id="profile-phone" value={phone} onChange={(event) => setPhone(event.target.value)} /></div><div><label className="mb-1.5 block text-sm font-medium text-slate-700">Email / username</label><div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">{currentUser?.email}</div></div><Button onClick={saveProfile}><Save className="h-4 w-4" />{saved ? 'Saved' : 'Save changes'}</Button>{profileError && <p className="text-sm text-red-600">{profileError}</p>}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Your product access</CardTitle></CardHeader><CardContent><div className="mb-4 rounded-xl bg-slate-900 p-4 text-white"><div className="text-xs uppercase tracking-wider text-slate-400">Signed in as</div><div className="mt-1 text-lg font-bold">{roleNames[role]}</div><div className="mt-1 text-sm text-slate-300">{currentUser?.email}</div></div><div className="space-y-3">{roleFeatures[role].map((feature) => <div key={feature} className="flex items-start gap-2 text-sm text-slate-600"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{feature}</div>)}</div></CardContent></Card>
      </div>
    </div>
  );
}

function PageIntro({ icon: Icon, eyebrow, title, description }: { icon: React.ElementType; eyebrow: string; title: string; description: string }) {
  return <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white"><div className="mb-2 flex items-center gap-2 text-sm font-semibold text-sky-300"><Icon className="h-4 w-4" />{eyebrow}</div><h2 className="text-2xl font-bold">{title}</h2><p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-300">{description}</p></div>;
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return <Card><CardContent className="p-10 text-center"><Bell className="mx-auto h-8 w-8 text-slate-300" /><h3 className="mt-3 font-semibold text-slate-800">{title}</h3><p className="mt-1 text-sm text-slate-500">{description}</p></CardContent></Card>;
}
