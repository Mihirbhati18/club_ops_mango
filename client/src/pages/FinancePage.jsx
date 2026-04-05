import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { HiOutlineCurrencyDollar, HiOutlinePlus, HiOutlineX, HiOutlineExclamation } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CHART_COLORS = ['#00f0ff', '#7b61ff', '#00ff88', '#ffaa00', '#ff3366'];

export default function FinancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('');
  const [form, setForm] = useState({ type: 'income', category: 'event', title: '', amount: '', description: '', status: 'pending' });

  useEffect(() => { fetchFinance(); }, [filter]);

  const fetchFinance = async () => {
    try {
      const q = filter ? `?type=${filter}` : '';
      const res = await api.get(`/finance${q}`);
      setRecords(res.data.data);
      setSummary(res.data.summary || {});
    } catch { /* empty */ }
    setLoading(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/finance', { ...form, amount: Number(form.amount) });
      setShowForm(false);
      setForm({ type: 'income', category: 'event', title: '', amount: '', description: '', status: 'pending' });
      fetchFinance();
    } catch { /* empty */ }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this record?')) return;
    try { await api.delete(`/finance/${id}`); fetchFinance(); } catch { /* empty */ }
  };

  const pieData = [
    { name: 'Income', value: summary.totalIncome || 0 },
    { name: 'Sponsorship', value: summary.totalSponsorship || 0 },
    { name: 'Expenses', value: summary.totalExpense || 0 },
  ].filter(d => d.value > 0);

  const barData = [
    { name: 'Income', amount: summary.totalIncome || 0 },
    { name: 'Sponsors', amount: summary.totalSponsorship || 0 },
    { name: 'Expenses', amount: summary.totalExpense || 0 },
    { name: 'Pending', amount: summary.pendingAmount || 0 },
  ];

  if (loading) return <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>Loading finance...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>FINANCE</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Track income, expenses & sponsorships</p>
        </div>
        {user?.role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)} className="btn-neon text-xs">
            <span><HiOutlinePlus className="inline" /> ADD RECORD</span>
          </button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'Total Income', value: summary.totalIncome || 0, color: 'var(--accent-green)' },
          { label: 'Sponsorships', value: summary.totalSponsorship || 0, color: 'var(--accent-cyan)' },
          { label: 'Expenses', value: summary.totalExpense || 0, color: 'var(--accent-red)' },
          { label: 'Pending', value: summary.pendingAmount || 0, color: 'var(--accent-amber)' },
          { label: 'Balance', value: summary.balance || 0, color: 'var(--accent-purple)' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }} className="stat-card">
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: s.color }}>
              ₹{s.value.toLocaleString()}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Pending Payment Alert */}
      {(summary.pendingAmount || 0) > 0 && (
        <div className="mb-6 p-4 rounded-xl flex items-center gap-3"
          style={{ background: 'rgba(255,170,0,0.05)', border: '1px solid rgba(255,170,0,0.15)' }}>
          <HiOutlineExclamation className="text-xl flex-shrink-0" style={{ color: 'var(--accent-amber)' }} />
          <p className="text-sm" style={{ color: 'var(--accent-amber)' }}>
            You have ₹{(summary.pendingAmount || 0).toLocaleString()} in pending payments
          </p>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4 tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>OVERVIEW</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#8b8b9e', fontSize: 12 }} />
              <YAxis tick={{ fill: '#8b8b9e', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#e8e8e8' }} />
              <Bar dataKey="amount" fill="#00f0ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4 tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>DISTRIBUTION</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, idx) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#e8e8e8' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {['', 'income', 'expense', 'sponsorship'].map((f) => (
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>NEW RECORD</h3>
            <button onClick={() => setShowForm(false)}><HiOutlineX style={{ color: 'var(--text-muted)' }} /></button>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input-cyber" placeholder="Title" required />
            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="input-cyber" placeholder="Amount (₹)" required />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-cyber">
              <option value="income">Income</option><option value="expense">Expense</option>
              <option value="sponsorship">Sponsorship</option>
            </select>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-cyber">
              <option value="event">Event</option><option value="sponsorship">Sponsorship</option>
              <option value="membership">Membership</option><option value="donation">Donation</option>
              <option value="equipment">Equipment</option><option value="venue">Venue</option>
              <option value="marketing">Marketing</option><option value="other">Other</option>
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-cyber">
              <option value="pending">Pending</option><option value="completed">Completed</option>
            </select>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="input-cyber" placeholder="Description" />
            <button type="submit" className="py-2 rounded-lg text-sm font-semibold md:col-span-3"
              style={{ background: 'var(--accent-cyan)', color: 'var(--bg-primary)' }}>Add Record</button>
          </form>
        </motion.div>
      )}

      {/* Records Table */}
      {records.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <HiOutlineCurrencyDollar className="text-4xl mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>No finance records found</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-cyber">
              <thead>
                <tr>
                  <th>Title</th><th>Type</th><th>Category</th><th>Amount</th><th>Status</th><th>Date</th>
                  {user?.role === 'admin' && <th></th>}
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td className="font-medium">{r.title}</td>
                    <td><span className={`badge ${r.type === 'income' ? 'badge-green' : r.type === 'expense' ? 'badge-red' : 'badge-cyan'}`}>{r.type}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{r.category}</td>
                    <td className="font-mono font-semibold" style={{ color: r.type === 'expense' ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                      {r.type === 'expense' ? '-' : '+'}₹{r.amount.toLocaleString()}
                    </td>
                    <td><span className={`badge ${r.status === 'completed' ? 'badge-green' : 'badge-amber'}`}>{r.status}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{new Date(r.date).toLocaleDateString('en-IN')}</td>
                    {user?.role === 'admin' && (
                      <td><button onClick={() => handleDelete(r._id)} className="text-xs" style={{ color: 'var(--accent-red)' }}>Delete</button></td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
