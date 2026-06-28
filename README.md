# ● TaskFlow

A production-quality MERN task manager designed in the spirit of Linear, Vercel, and Notion. Clean architecture, modular code, and a handcrafted UI — not a template dashboard.

## Stack

**Frontend** — React (Vite), React Router, Axios, React Hook Form, Tailwind CSS, React Icons, React Hot Toast
**Backend** — Node.js, Express, MongoDB, Mongoose, dotenv, cors

## Project structure

```
TaskFlow/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── utils/          # ApiError, asyncHandler
│   └── server.js
└── frontend/
    └── src/
        ├── components/ # layout/, ui/, tasks/
        ├── context/    # Theme & Task providers
        ├── hooks/      # Reusable hooks
        ├── pages/      # Dashboard, NotFound
        ├── services/   # Axios + task service
        ├── styles/     # Tailwind entry
        └── utils/      # Formatters
```

## Getting started

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env       # then set MONGO_URI
npm run dev
```

The API listens on `http://localhost:5000` and exposes:

| Method | Route             | Description    |
| ------ | ----------------- | -------------- |
| GET    | `/api/health`     | Health check   |
| GET    | `/api/tasks`      | List tasks (supports `?status`, `?priority`, `?category`, `?search`, `?sort`) |
| GET    | `/api/tasks/:id`  | Get one        |
| POST   | `/api/tasks`      | Create         |
| PUT    | `/api/tasks/:id`  | Update         |
| DELETE | `/api/tasks/:id`  | Delete         |

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env       # VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open `http://localhost:5173`.

## Environment variables

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

## Design tokens

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

8px spacing system. Card radius `14px`. Button radius `10px`. Inter typeface (400–700).

## Features

- Create / edit / delete / mark complete — optimistic UI, no page reloads
- Search, status & priority filters, multi-key sort
- Validated modal form (React Hook Form) with inline errors
- Skeleton loaders, empty states, graceful error retry
- Dark / light theme toggle, persisted in `localStorage`
- Responsive: 3 columns desktop, 2 tablet, 1 mobile + floating add button
- Keyboard-friendly modals (`Esc` to close, focus rings)

## Production build

```bash
cd frontend && npm run build      # outputs to frontend/dist
cd backend  && npm start          # serves the API
```
