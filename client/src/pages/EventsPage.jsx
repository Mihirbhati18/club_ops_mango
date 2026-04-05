import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { HiOutlineCalendar, HiOutlinePlus, HiOutlineX, HiOutlineLocationMarker, HiOutlineClock, HiOutlineUsers } from 'react-icons/hi';

const statusColors = {
  draft: 'badge-amber', upcoming: 'badge-cyan', ongoing: 'badge-green', completed: 'badge-purple', cancelled: 'badge-red',
};

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '', venue: '', type: 'other', status: 'draft',
  });

  useEffect(() => { fetchEvents(); }, [filter]);

  const fetchEvents = async () => {
    try {
      const q = filter ? `?status=${filter}` : '';
      const res = await api.get(`/events${q}`);
      setEvents(res.data.data);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', form);
      setShowForm(false);
      setForm({ title: '', description: '', date: '', time: '', venue: '', type: 'other', status: 'draft' });
      fetchEvents();
    } catch { /* empty */ }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    try { await api.delete(`/events/${id}`); fetchEvents(); } catch { /* empty */ }
  };

  const handleRegister = async (id) => {
    try { await api.post(`/events/${id}/register`); fetchEvents(); } catch { /* empty */ }
  };

  if (loading) return <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Loading events...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>EVENTS</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage club events and activities</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'member') && (
          <button onClick={() => setShowForm(!showForm)} className="btn-neon text-xs">
            <span><HiOutlinePlus className="inline" /> CREATE EVENT</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'draft', 'upcoming', 'ongoing', 'completed'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
            style={{
              background: filter === f ? 'rgba(0,240,255,0.1)' : 'transparent',
              color: filter === f ? 'var(--accent-cyan)' : 'var(--text-muted)',
              border: `1px solid ${filter === f ? 'rgba(0,240,255,0.3)' : 'var(--border-glass)'}`,
            }}>
            {f || 'All'}
          </button>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>NEW EVENT</h3>
            <button onClick={() => setShowForm(false)}><HiOutlineX style={{ color: 'var(--text-muted)' }} /></button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-cyber" placeholder="Event title" required />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input-cyber" required />
            <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="input-cyber" placeholder="Time (e.g. 02:00 PM)" required />
            <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="input-cyber" placeholder="Venue" required />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-cyber">
              <option value="workshop">Workshop</option><option value="seminar">Seminar</option>
              <option value="hackathon">Hackathon</option><option value="meetup">Meetup</option>
              <option value="competition">Competition</option><option value="social">Social</option>
              <option value="other">Other</option>
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-cyber">
              <option value="draft">Draft</option><option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option><option value="completed">Completed</option>
            </select>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-cyber md:col-span-2" placeholder="Description" rows={3} required />
            <button type="submit" className="py-2 rounded-lg text-sm font-semibold md:col-span-2"
              style={{ background: 'var(--accent-cyan)', color: 'var(--bg-primary)' }}>Create Event</button>
          </form>
        </motion.div>
      )}

      {/* Events */}
      {events.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiOutlineCalendar className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No events yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event, i) => (
            <motion.div key={event._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} className="glass-card p-6 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className={`badge ${statusColors[event.status]}`}>{event.status}</span>
                <span className="badge badge-purple">{event.type}</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
              <p className="text-sm mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>
                {event.description?.substring(0, 100)}{event.description?.length > 100 ? '...' : ''}
              </p>
              <div className="space-y-2 mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                <div className="flex items-center gap-2">
                  <HiOutlineCalendar style={{ color: 'var(--accent-cyan)' }} />
                  {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineClock style={{ color: 'var(--accent-purple)' }} />
                  {event.time}
                </div>
                <div className="flex items-center gap-2">
                  <HiOutlineLocationMarker style={{ color: 'var(--accent-green)' }} />
                  {event.venue}
                </div>
                {event.registration?.registered && (
                  <div className="flex items-center gap-2">
                    <HiOutlineUsers style={{ color: 'var(--accent-amber)' }} />
                    {event.registration.registered.length}{event.registration.limit > 0 ? `/${event.registration.limit}` : ''} registered
                  </div>
                )}
              </div>

              {/* Registration progress */}
              {event.registration?.limit > 0 && (
                <div className="mb-4">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min(100, (event.registration.registered.length / event.registration.limit) * 100)}%` }} />
                  </div>
                </div>
              )}

              {/* Approval checklist */}
              {event.approvalChecklist && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {Object.entries(event.approvalChecklist).map(([key, val]) => (
                    <span key={key} className="text-[10px] px-2 py-0.5 rounded" style={{
                      background: val ? 'rgba(0,255,136,0.1)' : 'rgba(255,51,102,0.1)',
                      color: val ? 'var(--accent-green)' : 'var(--accent-red)',
                    }}>
                      {val ? '✓' : '✗'} {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 mt-auto">
                {event.status === 'upcoming' && (
                  <button onClick={() => handleRegister(event._id)}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold"
                    style={{ background: 'rgba(0,240,255,0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(0,240,255,0.2)' }}>
                    Register
                  </button>
                )}
                {user?.role === 'admin' && (
                  <button onClick={() => handleDelete(event._id)}
                    className="px-3 py-2 rounded-lg text-xs" style={{ color: 'var(--accent-red)' }}>
                    Delete
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
