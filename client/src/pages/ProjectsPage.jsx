import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { HiOutlineLightningBolt, HiOutlinePlus, HiOutlineX, HiOutlineExternalLink } from 'react-icons/hi';

const statusBadge = { new: 'badge-cyan', ongoing: 'badge-amber', completed: 'badge-green' };

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'new', funding: '', tags: '', github: '' });

  useEffect(() => { fetchProjects(); }, [activeTab]);

  const fetchProjects = async () => {
    try {
      const q = activeTab ? `?status=${activeTab}` : '';
      const res = await api.get(`/projects${q}`);
      setProjects(res.data.data);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', {
        ...form,
        funding: Number(form.funding) || 0,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
      });
      setShowForm(false);
      setForm({ title: '', description: '', status: 'new', funding: '', tags: '', github: '' });
      fetchProjects();
    } catch { /* empty */ }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try { await api.delete(`/projects/${id}`); fetchProjects(); } catch { /* empty */ }
  };

  if (loading) return <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Loading projects...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>PROJECTS</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Track initiatives and achievements</p>
        </div>
        {(user?.role === 'admin' || user?.role === 'member') && (
          <button onClick={() => setShowForm(!showForm)} className="btn-neon text-xs">
            <span><HiOutlinePlus className="inline" /> NEW PROJECT</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { value: '', label: 'All' },
          { value: 'new', label: 'New' },
          { value: 'ongoing', label: 'Ongoing' },
          { value: 'completed', label: 'Completed' },
        ].map((tab) => (
          <button key={tab.value} onClick={() => setActiveTab(tab.value)}
            className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
            style={{
              background: activeTab === tab.value ? 'rgba(0,240,255,0.1)' : 'transparent',
              color: activeTab === tab.value ? 'var(--accent-cyan)' : 'var(--text-muted)',
              border: `1px solid ${activeTab === tab.value ? 'rgba(0,240,255,0.3)' : 'var(--border-glass)'}`,
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>NEW PROJECT</h3>
            <button onClick={() => setShowForm(false)}><HiOutlineX style={{ color: 'var(--text-muted)' }} /></button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-cyber" placeholder="Project title" required />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-cyber">
              <option value="new">New</option><option value="ongoing">Ongoing</option><option value="completed">Completed</option>
            </select>
            <input type="number" value={form.funding} onChange={(e) => setForm({ ...form, funding: e.target.value })}
              className="input-cyber" placeholder="Funding (₹)" />
            <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="input-cyber" placeholder="Tags (comma separated)" />
            <input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })}
              className="input-cyber md:col-span-2" placeholder="GitHub URL (optional)" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-cyber md:col-span-2" placeholder="Description" rows={3} required />
            <button type="submit" className="py-2 rounded-lg text-sm font-semibold md:col-span-2"
              style={{ background: 'var(--accent-cyan)', color: 'var(--bg-primary)' }}>Create Project</button>
          </form>
        </motion.div>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiOutlineLightningBolt className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No projects available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <motion.div key={project._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} className="glass-card p-6 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <span className={`badge ${statusBadge[project.status]}`}>{project.status}</span>
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    className="p-1 rounded hover:bg-white/5">
                    <HiOutlineExternalLink style={{ color: 'var(--text-muted)' }} />
                  </a>
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
              <p className="text-sm mb-4 flex-1" style={{ color: 'var(--text-secondary)' }}>
                {project.description?.substring(0, 120)}{project.description?.length > 120 ? '...' : ''}
              </p>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {project.tags.map((tag, ti) => (
                    <span key={ti} className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(123,97,255,0.1)', color: 'var(--accent-purple)' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Info */}
              <div className="flex items-center justify-between text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
                <span>{project.members?.length || 0} members</span>
                {project.funding > 0 && <span style={{ color: 'var(--accent-green)' }}>₹{project.funding.toLocaleString()}</span>}
              </div>

              {/* Lead */}
              {project.lead && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{ background: 'rgba(0,240,255,0.1)', color: 'var(--accent-cyan)' }}>
                    {project.lead.name?.charAt(0)}
                  </div>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Led by {project.lead.name}</span>
                </div>
              )}

              {/* Achievements */}
              {project.achievements && project.achievements.length > 0 && (
                <div className="mt-2 pt-3" style={{ borderTop: '1px solid var(--border-glass)' }}>
                  <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: 'var(--accent-amber)' }}>Achievements</p>
                  {project.achievements.slice(0, 2).map((a, ai) => (
                    <p key={ai} className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>🏆 {a.title}</p>
                  ))}
                </div>
              )}

              {user?.role === 'admin' && (
                <button onClick={() => handleDelete(project._id)}
                  className="mt-3 text-xs text-right" style={{ color: 'var(--accent-red)' }}>Delete</button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
