import { Menu, Bell, Search, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notifications } from '../../data/mockData';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

const typeColors: Record<string, string> = {
  pickup: 'bg-green-100 text-green-700',
  drop: 'bg-blue-100 text-blue-700',
  alert: 'bg-amber-100 text-amber-700',
  delay: 'bg-orange-100 text-orange-700',
  emergency: 'bg-red-100 text-red-700',
  info: 'bg-slate-100 text-slate-700',
};

const typeIcons: Record<string, string> = {
  pickup: '🟢', drop: '🔵', alert: '⚠️', delay: '🕐', emergency: '🚨', info: 'ℹ️',
};

export function Header({ title, onMenuClick }: HeaderProps) {
  const { currentUser } = useAuth();
  const role = currentUser?.role ?? 'admin';
  const [notifOpen, setNotifOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);

  const relevant = notifications.filter(n => n.targetRoles.includes(role));
  const unread = relevant.filter(n => !n.read && !readIds.includes(n.id)).length;

  const markAllRead = () => setReadIds(relevant.map(n => n.id));

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 gap-4 sticky top-0 z-20 shadow-sm">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1">
        <h1 className="text-slate-800 font-bold text-lg">{title}</h1>
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 w-56">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-sm text-slate-600 outline-none w-full placeholder:text-slate-400"
        />
      </div>

      {/* Live indicator */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
        LIVE
      </div>

      {/* Refresh */}
      <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
        <RefreshCw className="w-4 h-4" />
      </button>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(o => !o)}
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-40 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                  <span className="font-bold text-slate-800">Notifications</span>
                  {unread > 0 && (
                    <button onClick={markAllRead} className="text-xs text-blue-600 hover:underline">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {relevant.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">No notifications</div>
                  ) : (
                    relevant.map(n => {
                      const isRead = n.read || readIds.includes(n.id);
                      return (
                        <div
                          key={n.id}
                          className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${!isRead ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-base mt-0.5 flex-shrink-0">{typeIcons[n.type]}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-700 leading-relaxed">{n.message}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${typeColors[n.type]}`}>
                                  {n.type}
                                </span>
                                <span className="text-xs text-slate-400">{n.timestamp}</span>
                              </div>
                            </div>
                            {!isRead && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="px-4 py-2 text-center border-t border-slate-100">
                  <button className="text-xs text-blue-600 hover:underline">View all notifications</button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0 cursor-pointer">
        {currentUser?.name?.charAt(0) ?? 'U'}
      </div>
    </header>
  );
}
