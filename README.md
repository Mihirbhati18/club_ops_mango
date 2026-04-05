# CLUB-OPS 🚀
### CYSCOM Operations System

A futuristic, full-stack club operations command center built with React, Express, and MongoDB.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)

---

## ✨ Features

- 🌌 **Immersive Cover Page** — Boot animation with particle effects
- 🔐 **JWT Authentication** — Secure login/register with role-based access (Admin/Member/Viewer)
- 🧠 **Control Room Dashboard** — Orbit UI navigation, animated stats, activity feed
- 📁 **Departments** — Technical/non-technical sections with tasks, progress tracking
- 🎯 **Events** — Full event lifecycle with registration, approval checklists, expense tracking
- 💰 **Finance** — Income/expense/sponsorship tracking with charts
- 🚀 **Projects** — Tabbed view with status tracking and achievements
- 📡 **Meetings** — Schedule, agenda, minutes, countdown timer, announcements
- 🔍 **Global Search** — Search across members, events, projects
- 🔔 **Notifications** — Event, meeting, and payment alerts
- 📱 **Responsive** — Desktop command center + mobile-friendly layout
- 🛡️ **Security** — Helmet, rate limiting, input validation, NoSQL injection prevention

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT, bcrypt, HTTP-only cookies |
| Security | Helmet, express-rate-limit, joi, mongo-sanitize |

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- MongoDB running locally (or MongoDB Atlas URI)

### 1. Clone & Install
```bash
git clone https://github.com/your-username/club-ops.git
cd club-ops
npm run install:all
```

### 2. Configure Environment
```bash
cp server/.env.example server/.env
# Edit server/.env with your MongoDB URI and JWT secret
```

### 3. Seed Database (Sample Data)
```bash
cd server && npm run seed
```

### 4. Run Development Servers
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### 5. Login with Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@clubops.com | admin123 |
| Member | arjun@clubops.com | member123 |
| Viewer | rahul@clubops.com | viewer123 |

## 📂 Project Structure

```
club-ops/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/            # Axios instance
│   │   ├── components/     # Shared components
│   │   ├── context/        # Auth context
│   │   └── pages/          # Page components
│   └── ...
├── server/                 # Express backend
│   ├── config/             # DB config
│   ├── controllers/        # Route handlers
│   ├── middleware/          # Auth, roles, error handling
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── validators/         # Input validation (Joi)
│   └── server.js           # Entry point
├── docs/                   # Documentation
└── .github/                # Contribution templates
```

## 🔐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register user |
| POST | /api/auth/login | No | Login |
| POST | /api/auth/logout | Yes | Logout |
| GET | /api/auth/me | Yes | Current user |
| GET | /api/users | Admin | List users |
| CRUD | /api/departments | Role | Department ops |
| CRUD | /api/events | Role | Event ops |
| CRUD | /api/finance | Role | Finance ops |
| CRUD | /api/projects | Role | Project ops |
| CRUD | /api/meetings | Role | Meeting ops |
| GET | /api/search?q= | Yes | Global search |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
