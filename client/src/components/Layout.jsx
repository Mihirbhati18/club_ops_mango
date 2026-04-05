import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineViewGrid, HiOutlineUserGroup, HiOutlineCalendar,
  HiOutlineCurrencyDollar, HiOutlineLightningBolt, HiOutlineChatAlt2,
  HiOutlineInformationCircle, HiOutlineLogout, HiOutlineMenu,
  HiOutlineX, HiOutlineSearch, HiOutlineBell
} from 'react-icons/hi';
import GlobalSearch from './GlobalSearch';
import NotificationDropdown from './NotificationDropdown';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
  { path: '/departments', label: 'Departments', icon: HiOutlineUserGroup },
  { path: '/events', label: 'Events', icon: HiOutlineCalendar },
  { path: '/finance', label: 'Finance', icon: HiOutlineCurrencyDollar },
  { path: '/projects', label: 'Projects', icon: HiOutlineLightningBolt },
  { path: '/meetings', label: 'Meetings', icon: HiOutlineChatAlt2 },
  { path: '/about', label: 'About', icon: HiOutlineInformationCircle },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop hidden md:flex flex-col w-64 fixed h-full z-40"
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-glass)' }}>
        {/* Logo */}
        <div className="p-6 pb-4">
          <h1 className="text-xl font-bold tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>
            CLUB-OPS
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>CYSCOM Operations System</p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-2 space-y-1">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <item.icon className="text-lg" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4" style={{ borderTop: '1px solid var(--border-glass)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'rgba(0, 240, 255, 0.1)', color: 'var(--accent-cyan)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{user?.role?.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-all hover:bg-red-500/10"
            style={{ color: 'var(--accent-red)' }}>
            <HiOutlineLogout /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-72 z-50 flex flex-col md:hidden"
              style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-glass)' }}>
              <div className="flex items-center justify-between p-5">
                <h1 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>CLUB-OPS</h1>
                <button onClick={() => setMobileOpen(false)}><HiOutlineX className="text-xl" style={{ color: 'var(--text-secondary)' }} /></button>
              </div>
              <nav className="flex-1 px-3 py-2 space-y-1">
                {navItems.map((item) => (
                  <NavLink key={item.path} to={item.path} onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <item.icon className="text-lg" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-4" style={{ borderTop: '1px solid var(--border-glass)' }}>
                <button onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm" style={{ color: 'var(--accent-red)' }}>
                  <HiOutlineLogout /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 md:ml-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-6 h-16"
          style={{ background: 'rgba(10,10,15,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-glass)' }}>
          <div className="flex items-center gap-4">
            <button className="md:hidden" onClick={() => setMobileOpen(true)}>
              <HiOutlineMenu className="text-2xl" style={{ color: 'var(--text-secondary)' }} />
            </button>
            <button onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
              style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
              <HiOutlineSearch /> <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline text-xs px-1.5 py-0.5 rounded ml-2" style={{ background: 'rgba(255,255,255,0.05)' }}>Ctrl+K</kbd>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg transition-colors hover:bg-white/5">
                <HiOutlineBell className="text-xl" style={{ color: 'var(--text-secondary)' }} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: 'var(--accent-red)' }}></span>
              </button>
              {notifOpen && <NotificationDropdown onClose={() => setNotifOpen(false)} />}
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'rgba(123, 97, 255, 0.15)', color: 'var(--accent-purple)' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>

      {/* Search Modal */}
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </div>
  );
}
