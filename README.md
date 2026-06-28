# ● TaskFlow

A production-quality MERN task manager designed in the spirit of Linear, Vercel, and Notion. Clean architecture, modular code, and a handcrafted UI — not a template dashboard.

🌐 **Live Demo → [https://task-tracker-two-tawny.vercel.app](https://task-tracker-two-tawny.vercel.app)**

---

## Features

### ✅ Task Management
- **Create, edit, delete** tasks with a smooth validated modal form
- **Mark complete / reopen** tasks with a single click — instant optimistic update, no page reload
- **Archive & restore** — soft-delete tasks instead of losing them permanently
- **Per-task notes** — add rich personal context, links, or reminders (up to 4000 characters)
- **Activity timeline** — every change (create, complete, priority shift, archive, restore) is logged with a timestamp inside each task

### 🔍 Search, Filter & Sort
- **Global search** across title and description with 300ms debounce
- **Status filter** — Pending / In Progress / Completed
- **Priority filter** — Low / Medium / High
- **Multi-key sort** — Newest, Oldest, Due date, Priority, Title, Completed-first, Pending-first

### 📋 Smart Views
- **Dashboard** — all active tasks with stats (Total, Pending, In Progress, Completed + overdue count)
- **Today** — tasks due today that are not yet completed
- **Upcoming** — tasks due after today
- **Completed** — all finished tasks
- **Archived** — tasks you've put aside, searchable and restorable

### 🎨 UI & UX
- **Optimistic UI** — all mutations (create, update, toggle, archive, delete) update the interface instantly and roll back gracefully on API failure
- **Task Details Drawer** — slide-open panel showing full metadata, notes editor, and activity timeline
- **⌘K / Ctrl+K Command Palette** — keyboard-driven navigation, task creation, theme toggle, and settings
- **Skeleton loaders** on every list and stat card — no layout shifts during loading
- **Empty states** with context-aware illustrations and prompts
- **Confirm dialogs** before destructive actions (delete, clear archive)
- **Dark / Light theme** toggle, persisted in `localStorage`
- **Custom background** — set a wallpaper image with blur and overlay controls
- **Responsive layout** — 1 column mobile, 2 tablet, sidebar + content desktop
- **Mobile floating action button** for quick task creation
- **Keyboard accessibility** — `Esc` to close modals/drawers, visible focus rings throughout
- **Toast notifications** for every action (success + error)

### 🔐 Auth & Privacy
- **Email-based sessions** — enter your name + email once, tasks are scoped to your email
- **Guest mode** — try the app without any sign-in
- **Local session** — credentials stay in `localStorage`, never sent to a third-party auth service
- **No passwords** — the backend validates ownership via `X-User-Email` header

---

## Stack

**Frontend** — React (Vite), React Router v6, Axios, React Hook Form, Tailwind CSS, React Icons, React Hot Toast, Framer Motion  
**Backend** — Node.js, Express, MongoDB Atlas, Mongoose, dotenv, cors

---

## Project Structure

```
TaskFlow/
├── backend/
│   ├── config/         # MongoDB connection (retry + backoff)
│   ├── controllers/    # Route handlers + activity tracking
│   ├── middleware/     # Error handling, owner auth
│   ├── models/         # Task schema + activity subdocument
│   ├── routes/         # Express routers
│   ├── utils/          # ApiError, asyncHandler
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── auth/   # Protected & PublicOnly route guards
        │   ├── layout/ # Sidebar, Topbar, CommandPalette, SettingsPanel, BackgroundPanel
        │   ├── tasks/  # TaskCard, TaskForm, TaskDetailsDrawer, Toolbar, FilterMenu
        │   └── ui/     # Button, Modal, Badge, Field, Skeleton, EmptyState
        ├── context/    # AuthContext, TaskContext, ThemeContext, BackgroundContext
        ├── hooks/      # useDebounce, useSearch, useTaskStats
        ├── pages/      # Landing, Login, Dashboard, Archive, NotFound
        ├── services/   # Axios instance + taskService
        └── utils/      # Date formatters, relativeTime
```

---

## Getting Started (Local)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in MONGO_URI and CLIENT_ORIGIN
npm run dev
```

The API listens on `http://localhost:5000` and exposes:

| Method | Route                    | Description                                                                    |
| ------ | ------------------------ | ------------------------------------------------------------------------------ |
| GET    | `/api/health`            | Health check                                                                   |
| GET    | `/api/tasks`             | List tasks — supports `?status`, `?priority`, `?category`, `?search`, `?sort`, `?archived` |
| GET    | `/api/tasks/:id`         | Get one task                                                                   |
| POST   | `/api/tasks`             | Create task                                                                    |
| PUT    | `/api/tasks/:id`         | Update task                                                                    |
| DELETE | `/api/tasks/:id`         | Permanently delete                                                             |
| POST   | `/api/tasks/:id/archive` | Archive task                                                                   |
| POST   | `/api/tasks/:id/restore` | Restore from archive                                                           |

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open `http://localhost:5173`.

---

## Environment Variables

**backend/.env**

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/taskflow
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**frontend/.env**

```
VITE_API_URL=http://localhost:5000/api
```

### Deploying (Render + Vercel)

| Service | Variable        | Production value                                      |
| ------- | --------------- | ----------------------------------------------------- |
| Render  | `CLIENT_ORIGIN` | `https://task-tracker-two-tawny.vercel.app`           |
| Render  | `MONGO_URI`     | Your MongoDB Atlas connection string                  |
| Render  | `NODE_ENV`      | `production`                                          |
| Vercel  | `VITE_API_URL`  | `https://taskflow-api-j8e6.onrender.com/api`          |

> **Note:** Render's free tier spins down after 15 min of inactivity. The first request after a cold start may take 30–60 seconds.

---

## Design Tokens

| Token        | Value     |
| ------------ | --------- |
| Background   | `#0F172A` |
| Surface      | `#1E293B` |
| Border       | `#334155` |
| Primary      | `#6366F1` |
| Primary hov. | `#4F46E5` |
| Text         | `#F8FAFC` |
| Muted        | `#CBD5E1` |
| Success      | `#22C55E` |
| Warning      | `#F59E0B` |
| Danger       | `#EF4444` |

8px spacing system · Card radius `14px` · Button radius `10px` · Inter typeface (400–700)

---

## Production Build

```bash
cd frontend && npm run build   # outputs to frontend/dist
cd backend  && npm start       # serves the API
```
