import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { HiOutlineChatAlt2, HiOutlinePlus, HiOutlineX, HiOutlineClock, HiOutlineLocationMarker } from 'react-icons/hi';

function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { setTimeLeft('Started'); return; }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${days}d ${hours}h ${mins}m`);
    };
    calc();
    const timer = setInterval(calc, 60000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return <span>{timeLeft}</span>;
}

const statusBadge = { scheduled: 'badge-cyan', ongoing: 'badge-amber', completed: 'badge-green', cancelled: 'badge-red' };

export default function MeetingsPage() {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', venue: '', type: 'general' });

  useEffect(() => { fetchMeetings(); }, []);

  const fetchMeetings = async () => {
    try {
      const res = await api.get('/meetings');
      setMeetings(res.data.data);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/meetings', form);
      setShowForm(false);
      setForm({ title: '', description: '', date: '', time: '', venue: '', type: 'general' });
      fetchMeetings();
    } catch { /* empty */ }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this meeting?')) return;
    try { await api.delete(`/meetings/${id}`); fetchMeetings(); } catch { /* empty */ }
  };

  const nextMeeting = meetings.find((m) => m.status === 'scheduled' && new Date(m.date) > new Date());

  if (loading) return <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Loading meetings...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>MEETINGS</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Schedule, minutes & announcements</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'member') && (
          <button onClick={() => setShowForm(!showForm)} className="btn-neon text-xs">
            <span><HiOutlinePlus className="inline" /> SCHEDULE</span>
          </button>
        )}
      </div>

      {/* Next Meeting Countdown */}
      {nextMeeting && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-6 animate-pulse-glow" style={{ borderColor: 'rgba(0,240,255,0.2)' }}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>
                NEXT MEETING
              </p>
              <h3 className="text-xl font-bold">{nextMeeting.title}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                <span className="flex items-center gap-1"><HiOutlineClock /> {nextMeeting.time}</span>
                <span className="flex items-center gap-1"><HiOutlineLocationMarker /> {nextMeeting.venue || 'TBD'}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Countdown</p>
              <p className="text-2xl font-bold font-mono" style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>
                <CountdownTimer targetDate={nextMeeting.date} />
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Announcements */}
      {meetings.some((m) => m.announcements?.length > 0) && (
        <div className="glass-card p-6 mb-6">
          <h3 className="text-sm font-semibold mb-4 tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-amber)' }}>
            ANNOUNCEMENTS
          </h3>
          <div className="space-y-3">
            {meetings.flatMap((m) => m.announcements || []).slice(0, 5).map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ background: a.priority === 'high' ? 'var(--accent-red)' : a.priority === 'medium' ? 'var(--accent-amber)' : 'var(--accent-green)' }} />
                <div>
                  <p className="text-sm">{a.content}</p>
                  <span className={`badge mt-1 ${a.priority === 'high' ? 'badge-red' : a.priority === 'medium' ? 'badge-amber' : 'badge-green'}`}>
                    {a.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>SCHEDULE MEETING</h3>
            <button onClick={() => setShowForm(false)}><HiOutlineX style={{ color: 'var(--text-muted)' }} /></button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-cyber" placeholder="Meeting title" required />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="input-cyber" required />
            <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="input-cyber" placeholder="Time (e.g. 06:00 PM)" required />
            <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })}
              className="input-cyber" placeholder="Venue" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-cyber">
              <option value="general">General</option><option value="department">Department</option>
              <option value="emergency">Emergency</option><option value="review">Review</option>
            </select>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-cyber" placeholder="Description" />
            <button type="submit" className="py-2 rounded-lg text-sm font-semibold md:col-span-2"
              style={{ background: 'var(--accent-cyan)', color: 'var(--bg-primary)' }}>Schedule Meeting</button>
          </form>
        </motion.div>
      )}

      {/* Meetings List */}
      {meetings.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiOutlineChatAlt2 className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No meetings scheduled</p>
        </div>
      ) : (
        <div className="space-y-4">
          {meetings.map((meeting, i) => (
            <motion.div key={meeting._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} className="glass-card p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{meeting.title}</h3>
                    <span className={`badge ${statusBadge[meeting.status]}`}>{meeting.status}</span>
                    <span className="badge badge-purple">{meeting.type}</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{meeting.description}</p>
                </div>
                {user?.role === 'admin' && (
                  <button onClick={() => handleDelete(meeting._id)} className="text-xs" style={{ color: 'var(--accent-red)' }}>Delete</button>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1">
                  <HiOutlineClock style={{ color: 'var(--accent-cyan)' }} />
                  {new Date(meeting.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} at {meeting.time}
                </span>
                {meeting.venue && (
                  <span className="flex items-center gap-1">
                    <HiOutlineLocationMarker style={{ color: 'var(--accent-green)' }} />
                    {meeting.venue}
                  </span>
                )}
                <span>{meeting.attendees?.length || 0} attendees</span>
              </div>

              {/* Agenda */}
              {meeting.agenda && meeting.agenda.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--accent-purple)' }}>Agenda</p>
                  <div className="space-y-1">
                    {meeting.agenda.map((item, ai) => (
                      <div key={ai} className="flex items-center justify-between text-sm py-1.5 px-3 rounded"
                        style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <span>{item.topic}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.duration} min</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Minutes */}
              {meeting.minutes && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border-glass)' }}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--accent-green)' }}>Minutes</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{meeting.minutes}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
