# CLUB-OPS API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require a JWT token sent via:
- HTTP-only cookie (automatic after login)
- OR `Authorization: Bearer <token>` header

## Endpoints

### Auth
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | /auth/register | `{name, email, password, role}` | `{token, user}` |
| POST | /auth/login | `{email, password}` | `{token, user}` |
| POST | /auth/logout | - | `{message}` |
| GET | /auth/me | - | `{user}` |

### Users (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | List all users |
| GET | /users/:id | Get user by ID |
| PUT | /users/:id | Update user |
| DELETE | /users/:id | Delete user |

### Departments
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | /departments | All | List departments |
| GET | /departments/:id | All | Get department |
| POST | /departments | Admin | Create department |
| PUT | /departments/:id | Admin | Update department |
| DELETE | /departments/:id | Admin | Delete department |
| POST | /departments/:id/members | Admin, Member | Add member |
| POST | /departments/:id/tasks | Admin, Member | Add task |
| PUT | /departments/:id/tasks/:taskId | Admin, Member | Update task |

### Events
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | /events | All | List events (query: status, type, date) |
| GET | /events/:id | All | Get event |
| POST | /events | Admin, Member | Create event |
| PUT | /events/:id | Admin, Member | Update event |
| DELETE | /events/:id | Admin | Delete event |
| POST | /events/:id/register | All | Register for event |
| POST | /events/:id/expenses | Admin, Member | Add expense |

### Finance (All read, Admin write)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /finance | List records (query: type, category, status) + summary |
| POST | /finance | Create record |
| PUT | /finance/:id | Update record |
| DELETE | /finance/:id | Delete record |

### Projects
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | /projects | All | List projects (query: status) |
| POST | /projects | Admin, Member | Create project |
| PUT | /projects/:id | Admin, Member | Update project |
| DELETE | /projects/:id | Admin | Delete project |
| POST | /projects/:id/members | Admin, Member | Add member |
| POST | /projects/:id/achievements | Admin, Member | Add achievement |

### Meetings
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET | /meetings | All | List meetings (query: status, type) |
| POST | /meetings | Admin, Member | Create meeting |
| PUT | /meetings/:id | Admin, Member | Update meeting |
| DELETE | /meetings/:id | Admin | Delete meeting |
| POST | /meetings/:id/announcements | Admin, Member | Add announcement |

### Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /search?q=query | Search across users, events, projects |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | API health check |
