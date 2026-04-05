import { motion } from 'framer-motion';
import { HiOutlineCalendar, HiOutlineCash, HiOutlineBell } from 'react-icons/hi';

const notifications = [
  { id: 1, type: 'event', icon: HiOutlineCalendar, title: 'HackNova 2026 registrations open', time: '2 hours ago', color: 'var(--accent-cyan)' },
  { id: 2, type: 'meeting', icon: HiOutlineBell, title: 'Weekly Sync tomorrow at 6 PM', time: '5 hours ago', color: 'var(--accent-purple)' },
  { id: 3, type: 'payment', icon: HiOutlineCash, title: 'Pending payment: Social Media Ads', time: '1 day ago', color: 'var(--accent-amber)' },
  { id: 4, type: 'event', icon: HiOutlineCalendar, title: 'AI Workshop Series - 50 seats left', time: '2 days ago', color: 'var(--accent-green)' },
];

export default function NotificationDropdown({ onClose }) {
  return (
    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
      className="absolute right-0 top-12 w-80 rounded-xl overflow-hidden z-50"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
      <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border-glass)' }}>
        <h3 className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>NOTIFICATIONS</h3>
        <span className="badge badge-cyan">4 new</span>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {notifications.map((n) => (
          <div key={n.id} className="flex items-start gap-3 p-4 transition-colors hover:bg-white/3 cursor-pointer"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
            <div className="p-2 rounded-lg" style={{ background: `${n.color}15`, color: n.color }}>
              <n.icon className="text-lg" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 text-center" style={{ borderTop: '1px solid var(--border-glass)' }}>
        <button className="text-xs font-medium" style={{ color: 'var(--accent-cyan)' }}>View All Notifications</button>
      </div>
    </motion.div>
  );
}
