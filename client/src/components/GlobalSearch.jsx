import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function GlobalSearch({ onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], events: [], projects: [] });
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim()) { setResults({ users: [], events: [], projects: [] }); return; }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.data);
      } catch { setResults({ users: [], events: [], projects: [] }); }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const totalResults = results.users.length + results.events.length + results.projects.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)' }}
        onClick={(e) => e.stopPropagation()}>
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4" style={{ borderBottom: '1px solid var(--border-glass)' }}>
          <HiOutlineSearch className="text-xl" style={{ color: 'var(--accent-cyan)' }} />
          <input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, members, projects..."
            className="flex-1 bg-transparent outline-none text-sm" style={{ color: 'var(--text-primary)' }} />
          <button onClick={onClose} className="p-1 rounded hover:bg-white/5">
            <HiOutlineX style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {loading && <p className="text-center py-6 text-sm" style={{ color: 'var(--text-muted)' }}>Searching...</p>}
          {!loading && query && totalResults === 0 && (
            <p className="text-center py-6 text-sm" style={{ color: 'var(--text-muted)' }}>No results found</p>
          )}
          {!loading && !query && (
            <p className="text-center py-6 text-sm" style={{ color: 'var(--text-muted)' }}>Type to search across the system</p>
          )}

          {results.users.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-semibold px-3 py-2 uppercase tracking-wider" style={{ color: 'var(--accent-cyan)' }}>Members</p>
              {results.users.map((u) => (
                <button key={u._id} onClick={() => { onClose(); navigate('/departments'); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left text-sm transition-colors hover:bg-white/5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(0,240,255,0.1)', color: 'var(--accent-cyan)' }}>
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{u.role}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.events.length > 0 && (
            <div className="mb-2">
              <p className="text-xs font-semibold px-3 py-2 uppercase tracking-wider" style={{ color: 'var(--accent-purple)' }}>Events</p>
              {results.events.map((e) => (
                <button key={e._id} onClick={() => { onClose(); navigate('/events'); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left text-sm transition-colors hover:bg-white/5">
                  <span>{e.title}</span>
                  <span className="badge badge-cyan ml-auto">{e.status}</span>
                </button>
              ))}
            </div>
          )}

          {results.projects.length > 0 && (
            <div>
              <p className="text-xs font-semibold px-3 py-2 uppercase tracking-wider" style={{ color: 'var(--accent-green)' }}>Projects</p>
              {results.projects.map((p) => (
                <button key={p._id} onClick={() => { onClose(); navigate('/projects'); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left text-sm transition-colors hover:bg-white/5">
                  <span>{p.title}</span>
                  <span className="badge badge-green ml-auto">{p.status}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
