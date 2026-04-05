import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineGlobe, HiOutlineHeart } from 'react-icons/hi';

export default function AboutPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>ABOUT</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>CYSCOM Operations System</p>
      </div>

      {/* Mission */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 mb-6 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center animate-pulse-glow"
          style={{ background: 'rgba(0,240,255,0.05)', border: '2px solid rgba(0,240,255,0.2)' }}>
          <span className="text-3xl font-black" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>C-O</span>
        </div>
        <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>
          OUR MISSION
        </h2>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          To empower the next generation of tech leaders through collaborative learning,
          innovation, and hands-on experience. We build, we learn, we grow — together.
        </p>
      </motion.div>

      {/* Club Introduction */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-8 mb-6">
        <h3 className="text-sm font-semibold mb-4 tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>
          THE CLUB
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              CYSCOM (Cyber Security Community) is a student-driven technical club focused on
              cybersecurity, software development, AI/ML, and emerging technologies. Founded with the
              vision of creating a community of passionate technologists, we organize workshops,
              hackathons, seminars, and collaborative projects throughout the year.
            </p>
            <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--text-secondary)' }}>
              Our club operates through specialized departments — each focused on different
              domains of technology. Members gain hands-on experience, build their portfolios,
              and develop leadership skills through active participation.
            </p>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Founded', value: '2020' },
              { label: 'Active Members', value: '50+' },
              { label: 'Events Hosted', value: '30+' },
              { label: 'Projects Completed', value: '15+' },
              { label: 'Departments', value: '4' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid var(--border-glass)' }}>
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                <span className="font-semibold" style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Faculty Coordinators */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card p-8 mb-6">
        <h3 className="text-sm font-semibold mb-6 tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>
          FACULTY COORDINATORS
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Dr. Arun Kumar', role: 'Faculty Advisor', dept: 'Computer Science' },
            { name: 'Prof. Meera Singh', role: 'Technical Mentor', dept: 'Information Technology' },
            { name: 'Dr. Rajesh Nair', role: 'Research Guide', dept: 'Cybersecurity' },
          ].map((faculty, i) => (
            <div key={i} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-xl font-bold"
                style={{ background: 'rgba(123,97,255,0.1)', color: 'var(--accent-purple)', border: '1px solid rgba(123,97,255,0.2)' }}>
                {faculty.name.charAt(0)}
              </div>
              <h4 className="font-semibold">{faculty.name}</h4>
              <p className="text-xs mt-1" style={{ color: 'var(--accent-cyan)' }}>{faculty.role}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{faculty.dept}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contact */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass-card p-8 mb-6">
        <h3 className="text-sm font-semibold mb-4 tracking-wider" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>
          CONTACT US
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <HiOutlineMail className="text-xl" style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Email</p>
              <p className="text-sm">cyscom@university.edu</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <HiOutlineGlobe className="text-xl" style={{ color: 'var(--accent-purple)' }} />
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Website</p>
              <p className="text-sm">cyscom.tech</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)' }}>
            <HiOutlineHeart className="text-xl" style={{ color: 'var(--accent-red)' }} />
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Instagram</p>
              <p className="text-sm">@cyscom_official</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)' }}>
          JOIN THE SYSTEM
        </h2>
        <p className="mb-6 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
          Be part of something bigger. Join CYSCOM and shape the future of technology.
        </p>
        <button className="btn-neon">
          <span>APPLY NOW</span>
          <span>→</span>
        </button>
      </motion.div>
    </div>
  );
}
