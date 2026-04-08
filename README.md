# Job Application Tracker

A modern, full-stack application to track your job search progress. Features a FastAPI backend with PostgreSQL and a responsive React frontend with dark mode support.

## 🚀 Features

- **Full CRUD**: Create, read, update, and delete job applications.
- **Status Tracking**: Color-coded badges for different stages (Applied, Interview, Offer, etc.).
- **Theme Toggle**: Switch between Light and Dark modes (persisted in local storage).
- **Company Logos**: Automatically fetches company icons based on the job URL.
- **Responsive Design**: Mobile-first UI that works on all devices.
- **Modern Tech Stack**: React 19, TypeScript, Vite, FastAPI, and SQLAlchemy.

## 🛠️ Tech Stack

- **Frontend**: React (TS), Vite, Vanilla CSS, Lucide React.
- **Backend**: Python, FastAPI, SQLAlchemy (Async), PostgreSQL.
- **Database**: PostgreSQL with Alembic migrations.

---

## 🏗️ Getting Started

### 1. Backend Setup (WSL/Linux/Mac)

1. **Navigate to backend:**
   ```bash
   cd backend
   ```
2. **Create and activate virtual environment:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
3. **Install dependencies:**
   ```bash
   pip install -r app/requirements.txt
   ```
4. **Environment Variables:**
   Create a `.env` file in the `backend/` folder:
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5433/jobappdb
   CORS_ORIGINS=http://localhost:5173
   ```
   The backend now requires `DATABASE_URL` explicitly and prints the active database target on startup, so a missing or wrong value fails fast instead of silently falling back to another database.
5. **Run Migrations:**
   ```bash
   alembic upgrade head
   ```
6. **Start the server:**
   ```bash
   uvicorn app.main:app --reload
   ```

### 2. Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start development server:**
   ```bash
   npm run dev
   ```
   *The frontend will be available at `http://localhost:5173`.*

---

## 📁 Project Structure

```text
├── backend/
│   ├── app/           # FastAPI application logic
│   ├── alembic/       # Database migrations
│   └── .env           # Backend configuration
├── frontend/
│   ├── src/           # React components and logic
│   │   ├── api.ts     # API service layer
│   │   ├── App.tsx    # Main dashboard
│   │   └── App.css    # Responsive styles
│   └── vite.config.ts # Proxy configuration
└── README.md
```

## 📝 License

MIT
