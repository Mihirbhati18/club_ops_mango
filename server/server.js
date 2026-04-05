const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Sanitize data - prevent NoSQL injection
app.use(mongoSanitize());

// Prevent HTTP param pollution
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// Auth rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many authentication attempts' },
});
app.use('/api/auth', authLimiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/events', require('./routes/events'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/meetings', require('./routes/meetings'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'CLUB-OPS API is running', timestamp: new Date() });
});

// Search endpoint
app.get('/api/search', require('./middleware/auth'), async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Search query required' });

    const User = require('./models/User');
    const Event = require('./models/Event');
    const Project = require('./models/Project');

    const regex = new RegExp(q, 'i');

    const [users, events, projects] = await Promise.all([
      User.find({ $or: [{ name: regex }, { email: regex }] }).select('name email role').limit(10),
      Event.find({ $or: [{ title: regex }, { description: regex }] }).select('title date status').limit(10),
      Project.find({ $or: [{ title: regex }, { description: regex }] }).select('title status').limit(10),
    ]);

    res.status(200).json({ success: true, data: { users, events, projects } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Search failed' });
  }
});

// Error handler (must be after routes)
app.use(errorHandler);

// Handle unhandled routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\x1b[36m[SERVER] CLUB-OPS running on port ${PORT} in ${process.env.NODE_ENV} mode\x1b[0m`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`\x1b[31m[ERROR] ${err.message}\x1b[0m`);
  server.close(() => process.exit(1));
});
