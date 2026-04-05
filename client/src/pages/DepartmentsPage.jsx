import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { HiOutlineUserGroup, HiOutlinePlus, HiOutlineX } from 'react-icons/hi';

export default function DepartmentsPage() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'technical', description: '' });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { fetchDepartments(); }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/departments');
      setDepartments(res.data.data);
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/departments', form);
      setShowForm(false);
      setForm({ name: '', type: 'technical', description: '' });
      fetchDepartments();
    } catch { /* empty */ }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this department?')) return;
    try {
      await api.delete(`/departments/${id}`);
      fetchDepartments();
    } catch { /* empty */ }
  };

  const filtered = activeTab === 'all' ? departments
    : departments.filter((d) => d.type === activeTab);

  if (loading) return <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Loading departments...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>DEPARTMENTS</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage operational divisions</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)} className="btn-neon text-xs">
            <span><HiOutlinePlus className="inline" /> CREATE</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'technical', 'non-technical'].map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
            style={{
              background: activeTab === tab ? 'rgba(0,240,255,0.1)' : 'transparent',
              color: activeTab === tab ? 'var(--accent-cyan)' : 'var(--text-muted)',
              border: `1px solid ${activeTab === tab ? 'rgba(0,240,255,0.3)' : 'var(--border-glass)'}`,
            }}>
            {tab === 'non-technical' ? 'Non-Tech' : tab === 'technical' ? 'Technical' : 'All'}
          </button>
        ))}
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>NEW DEPARTMENT</h3>
            <button onClick={() => setShowForm(false)}><HiOutlineX style={{ color: 'var(--text-muted)' }} /></button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-cyber" placeholder="Department name" required />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-cyber">
              <option value="technical">Technical</option>
              <option value="non-technical">Non-Technical</option>
            </select>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-cyber" placeholder="Description" />
            <button type="submit" className="py-2 rounded-lg text-sm font-semibold md:col-span-3"
              style={{ background: 'var(--accent-cyan)', color: 'var(--bg-primary)' }}>Create Department</button>
          </form>
        </motion.div>
      )}

      {/* Department Cards */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiOutlineUserGroup className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No departments found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((dept, i) => (
            <motion.div key={dept._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{dept.name}</h3>
                    <span className={`badge ${dept.type === 'technical' ? 'badge-cyan' : 'badge-purple'}`}>
                      {dept.type}
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{dept.description}</p>
                </div>
                {user?.role === 'admin' && (
                  <button onClick={() => handleDelete(dept._id)} className="text-xs px-2 py-1 rounded hover:bg-red-500/10"
                    style={{ color: 'var(--accent-red)' }}>Delete</button>
                )}
              </div>

              {/* Lead */}
              {dept.lead && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'rgba(0,240,255,0.1)', color: 'var(--accent-cyan)' }}>
                    {dept.lead.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{dept.lead.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Command Head</p>
                  </div>
                </div>
              )}

              {/* Members count */}
              <div className="flex items-center gap-4 mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span>{dept.members?.length || 0} Members</span>
                <span>{dept.tasks?.length || 0} Tasks</span>
              </div>

              {/* Tasks Progress */}
              {dept.tasks && dept.tasks.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Tasks</p>
                  {dept.tasks.slice(0, 3).map((task, ti) => (
                    <div key={ti}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{task.title}</span>
                        <span className="text-xs font-mono" style={{ color: 'var(--accent-cyan)' }}>{task.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${task.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Leaderboard hint */}
              {dept.members && dept.members.length > 0 && (
                <div className="mt-4 pt-3" style={{ borderTop: '1px solid var(--border-glass)' }}>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    Top Contributor: <span style={{ color: 'var(--accent-green)' }}>{dept.members[0]?.user?.name || 'N/A'}</span>
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
