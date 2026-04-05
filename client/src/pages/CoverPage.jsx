import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const quotes = [
  "The future belongs to those who believe in the beauty of their dreams.",
  "Innovation distinguishes between a leader and a follower.",
  "Technology is best when it brings people together.",
  "The only way to do great work is to love what you do.",
];

export default function CoverPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0); // 0: init text, 1: logo, 2: quote, 3: ready
  const [displayText, setDisplayText] = useState('');
  const fullText = 'INITIALIZING CYSCOM OPERATIONS...';
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  // Typing animation
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) {
        clearInterval(timer);
        setTimeout(() => setPhase(1), 600);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (phase === 1) setTimeout(() => setPhase(2), 1500);
    if (phase === 2) setTimeout(() => setPhase(3), 2000);
  }, [phase]);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#000' }}>
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,240,255,0.01) 2px, rgba(0,240,255,0.01) 4px)' }} />

      <div className="relative z-20 text-center px-6 max-w-2xl">
        <AnimatePresence mode="wait">
          {/* Phase 0: Typing text */}
          {phase === 0 && (
            <motion.div key="init" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-sm md:text-base tracking-[0.3em]"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>
                {displayText}
                <span className="animate-pulse">▌</span>
              </p>
            </motion.div>
          )}

          {/* Phase 1: Logo reveal */}
          {phase >= 1 && (
            <motion.div key="logo"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15, stiffness: 100 }}>
              {/* Glowing ring */}
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center animate-pulse-glow"
                  style={{ border: '2px solid var(--accent-cyan)', background: 'rgba(0,240,255,0.03)' }}>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-black tracking-wider"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>
                      C-O
                    </div>
                    <div className="text-[10px] tracking-[0.2em] mt-1" style={{ color: 'var(--text-muted)' }}>
                      SYSTEM v1.0
                    </div>
                  </div>
                </div>
                {/* Orbit ring */}
                <div className="absolute inset-[-16px] rounded-full"
                  style={{ border: '1px solid rgba(0,240,255,0.15)', animation: 'spin 20s linear infinite' }} />
                <div className="absolute inset-[-32px] rounded-full"
                  style={{ border: '1px solid rgba(123,97,255,0.1)', animation: 'spin 30s linear infinite reverse' }} />
              </div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-black tracking-wider mb-2"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)', textShadow: '0 0 30px rgba(0,240,255,0.4)' }}>
                CLUB-OPS
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-sm tracking-[0.4em] mb-8" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-display)' }}>
                CYSCOM OPERATIONS SYSTEM
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 2: Quote */}
        {phase >= 2 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-sm md:text-base italic mb-10 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            "{quote}"
          </motion.p>
        )}

        {/* Phase 3: CTA Button */}
        {phase >= 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <button onClick={() => navigate('/login')} className="btn-neon" id="access-control-room">
              <span>ACCESS CONTROL ROOM</span>
              <span>→</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10"
        style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }} />
    </div>
  );
}
