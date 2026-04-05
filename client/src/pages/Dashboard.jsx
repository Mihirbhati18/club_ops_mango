import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  HiOutlineUserGroup, HiOutlineCalendar, HiOutlineCurrencyDollar,
  HiOutlineLightningBolt, HiOutlineChatAlt2, HiOutlineInformationCircle,
  HiOutlineChartBar, HiOutlineClipboardCheck
} from 'react-icons/hi';

const orbitModules = [
  { label: 'Departments', icon: HiOutlineUserGroup, path: '/departments', color: '#00f0ff', angle: 0 },
  { label: 'Events', icon: HiOutlineCalendar, path: '/events', color: '#7b61ff', angle: 60 },
  { label: 'Finance', icon: HiOutlineCurrencyDollar, path: '/finance', color: '#00ff88', angle: 120 },
  { label: 'Projects', icon: HiOutlineLightningBolt, path: '/projects', color: '#ffaa00', angle: 180 },
  { label: 'Meetings', icon: HiOutlineChatAlt2, path: '/meetings', color: '#ff3366', angle: 240 },
  { label: 'About', icon: HiOutlineInformationCircle, path: '/about', color: '#3b82f6', angle: 300 },
];

function AnimatedCounter({ target, duration = 2000 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span>{count}</span>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ members: 0, events: 0, revenue: 0, attendance: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, eventsRes, financeRes] = await Promise.all([
          api.get('/users').catch(() => ({ data: { count: 0 } })),
          api.get('/events').catch(() => ({ data: { count: 0 } })),
          api.get('/finance').catch(() => ({ data: { summary: { balance: 0 } } })),
        ]);
        setStats({
          members: usersRes.data?.count || usersRes.data?.data?.length || 0,
          events: eventsRes.data?.count || eventsRes.data?.data?.length || 0,
          revenue: financeRes.data?.summary?.balance || 0,
          attendance: 87,
        });
      } catch {
        setStats({ members: 5, events: 3, revenue: 41500, attendance: 87 });
      }
    };
    fetchStats();
  }, []);

  const radius = 160;

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>
          CONTROL ROOM
        </motion.h1>
        <p className="mt-1" style={{ color: 'var(--text-muted)' }}>
          Welcome back, <span style={{ color: 'var(--text-primary)' }}>{user?.name}</span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Members', value: stats.members, icon: HiOutlineUserGroup, color: 'var(--accent-cyan)' },
          { label: 'Active Events', value: stats.events, icon: HiOutlineCalendar, color: 'var(--accent-purple)' },
          { label: 'Total Revenue', value: stats.revenue, icon: HiOutlineCurrencyDollar, color: 'var(--accent-green)', prefix: '₹' },
          { label: 'Attendance', value: stats.attendance, icon: HiOutlineClipboardCheck, color: 'var(--accent-amber)', suffix: '%' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg" style={{ background: `${stat.color}12`, color: stat.color }}>
                <stat.icon className="text-xl" />
              </div>
              <HiOutlineChartBar className="text-lg" style={{ color: 'var(--text-muted)' }} />
            </div>
            <p className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'var(--font-display)', color: stat.color }}>
              {stat.prefix}<AnimatedCounter target={stat.value} />{stat.suffix}
            </p>
            <p className="text-xs mt-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Orbit UI + Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orbit Navigation */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 flex items-center justify-center min-h-[420px]">
          <div className="relative" style={{ width: radius * 2 + 120, height: radius * 2 + 120 }}>
            {/* Center Core */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-28 h-28 rounded-full flex items-center justify-center animate-pulse-glow"
                style={{ background: 'rgba(0,240,255,0.05)', border: '2px solid rgba(0,240,255,0.3)' }}>
                <div className="text-center">
                  <p className="text-[10px] font-semibold tracking-wider" style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>
                    CLUB STATUS
                  </p>
                  <p className="text-lg font-bold mt-0.5" style={{ color: 'var(--accent-green)', fontFamily: 'var(--font-display)' }}>
                    ACTIVE
                  </p>
                </div>
              </div>
            </div>

            {/* Orbit rings */}
            <div className="absolute inset-8 rounded-full" style={{ border: '1px dashed rgba(0,240,255,0.08)' }} />
            <div className="absolute inset-2 rounded-full" style={{ border: '1px dashed rgba(123,97,255,0.06)' }} />

            {/* Orbit Items */}
            {orbitModules.map((mod, i) => {
              const angleRad = (mod.angle * Math.PI) / 180;
              const x = Math.cos(angleRad) * radius;
              const y = Math.sin(angleRad) * radius;
              return (
                <motion.button key={mod.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => navigate(mod.path)}
                  className="absolute flex flex-col items-center gap-1 cursor-pointer group"
                  style={{
                    left: `calc(50% + ${x}px - 32px)`,
                    top: `calc(50% + ${y}px - 32px)`,
                  }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all"
                    style={{
                      background: `${mod.color}10`,
                      border: `1px solid ${mod.color}30`,
                      boxShadow: `0 0 0 0 ${mod.color}00`,
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 20px ${mod.color}40`}
                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 0 0 ${mod.color}00`}>
                    <mod.icon className="text-2xl" style={{ color: mod.color }} />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider opacity-60 group-hover:opacity-100 transition-opacity"
                    style={{ color: mod.color, fontFamily: 'var(--font-display)' }}>
                    {mod.label.toUpperCase()}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Info Panel */}
        <div className="space-y-4">
          {/* Recent Activity */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6">
            <h3 className="text-sm font-semibold mb-4 tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>
              RECENT ACTIVITY
            </h3>
            <div className="space-y-3">
              {[
                { text: 'HackNova 2026 event created', time: '2 hours ago', color: 'var(--accent-purple)' },
                { text: 'New member Sneha Patel joined', time: '5 hours ago', color: 'var(--accent-green)' },
                { text: 'AI Workshop registrations opened', time: '1 day ago', color: 'var(--accent-cyan)' },
                { text: 'TechCorp sponsorship confirmed', time: '2 days ago', color: 'var(--accent-amber)' },
                { text: 'Weekly Sync meeting scheduled', time: '3 days ago', color: 'var(--accent-red)' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>{item.text}</p>
                  <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{item.time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="glass-card p-6">
            <h3 className="text-sm font-semibold mb-4 tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>
              SYSTEM STATUS
            </h3>
            <div className="space-y-3">
              {[
                { label: 'API Server', status: 'Online', color: 'var(--accent-green)' },
                { label: 'Database', status: 'Connected', color: 'var(--accent-green)' },
                { label: 'Auth Service', status: 'Secured', color: 'var(--accent-green)' },
                { label: 'Next Meeting', status: 'Apr 7, 6PM', color: 'var(--accent-amber)' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <span className="badge" style={{ background: `${item.color}15`, color: item.color, border: `1px solid ${item.color}30` }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* User Role */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="glass-card p-6">
            <h3 className="text-sm font-semibold mb-3 tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>
              YOUR ACCESS
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ background: 'rgba(0,240,255,0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,240,255,0.2)' }}>
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--accent-purple)' }}>{user?.role} ACCESS</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
