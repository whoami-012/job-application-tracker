#!/bin/bash

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    # Kill background PIDs
    kill $(jobs -p) 2>/dev/null
    # Stop the database containe
    docker compose down 2>/dev/null
    echo "👋 Bye!"
    exit
}

# Trap Ctrl+C (SIGINT) and SIGTERM
trap cleanup SIGINT SIGTERM

echo "🚀 Starting Job Application Tracker Full Stack..."

# 1. Start Database Service
echo "🐘 Starting Database (PostgreSQL) via Docker Compose..."
docker compose up -d db

echo "⏳ Waiting for Database to be healthy..."
while [ "$(docker inspect --format='{{.State.Health.Status}}' job-tracker-db)" != "healthy" ]; do
    printf "."
    sleep 2
done
echo ""
echo "✅ Database is ready!"

# 2. Start Backend
echo "📡 Starting Backend (FastAPI) on port 8000..."
(
    cd backend
    if [ -d ".venv" ]; then
        source .venv/bin/activate
    fi
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
) &

# 3. Start Frontend
echo "💻 Starting Frontend (Vite) on port 5173..."
(
    cd frontend
    npm run dev -- --host
) &

echo ""
echo "🎉 All services are running!"
echo "👉 Frontend: http://localhost:5173"
echo "👉 Backend API: http://127.0.0.1:8000/docs"
echo "💡 Press Ctrl+C to stop all services (including the DB)."

# Keep the script running to wait for background jobs
wait
