import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('All fields are required'); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'linear-gradient(rgba(0,240,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <h1 className="text-2xl font-bold tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>
              CLUB-OPS
            </h1>
          </Link>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Access your command center</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          <h2 className="text-xl font-semibold mb-6" style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '2px', color: 'var(--text-primary)' }}>
            SYSTEM LOGIN
          </h2>

          {error && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 rounded-lg text-sm" style={{ background: 'rgba(255,51,102,0.1)', border: '1px solid rgba(255,51,102,0.2)', color: 'var(--accent-red)' }}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-cyber" placeholder="operator@clubops.com" id="login-email" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="input-cyber" placeholder="••••••••" id="login-password" />
            </div>
            <button type="submit" disabled={loading} id="login-submit"
              className="w-full py-3 rounded-lg font-semibold text-sm tracking-wider transition-all disabled:opacity-50"
              style={{ background: 'var(--accent-cyan)', color: 'var(--bg-primary)', fontFamily: 'var(--font-display)' }}>
              {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            New operative?{' '}
            <Link to="/register" className="font-medium" style={{ color: 'var(--accent-cyan)' }}>Register here</Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 p-4 rounded-xl text-center" style={{ background: 'rgba(123,97,255,0.05)', border: '1px solid rgba(123,97,255,0.1)' }}>
          <p className="text-xs mb-2" style={{ color: 'var(--accent-purple)', fontFamily: 'var(--font-display)' }}>DEMO ACCESS</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>admin@clubops.com / admin123</p>
        </div>
      </motion.div>
    </div>
  );
}
