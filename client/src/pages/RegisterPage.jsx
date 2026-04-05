import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'viewer' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) { setError('All fields are required'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'var(--bg-primary)' }}>
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <h1 className="text-2xl font-bold tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>CLUB-OPS</h1>
          </Link>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Join the operations network</p>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '2px' }}>
            NEW OPERATIVE
          </h2>

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.2)', color: 'var(--accent-red)' }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Full Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="input-cyber" placeholder="John Doe" id="register-name" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                className="input-cyber" placeholder="john@clubops.com" id="register-email" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                className="input-cyber" placeholder="Min 6 characters" id="register-password" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Access Level</label>
              <select name="role" value={form.role} onChange={handleChange}
                className="input-cyber" id="register-role">
                <option value="viewer">Viewer — Read Only</option>
                <option value="member">Member — Standard Access</option>
                <option value="admin">Admin — Full Control</option>
              </select>
            </div>
            <button type="submit" disabled={loading} id="register-submit"
              className="w-full py-3 rounded-lg font-semibold text-sm tracking-wider transition-all disabled:opacity-50"
              style={{ background: 'var(--accent-cyan)', color: 'var(--bg-primary)', fontFamily: 'var(--font-display)' }}>
              {loading ? 'REGISTERING...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            Already an operative?{' '}
            <Link to="/login" className="font-medium" style={{ color: 'var(--accent-cyan)' }}>Login here</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
