# Job Application Tracker — Architecture & Implementation Guide

## Overview
A full-stack application to track job applications, built with **FastAPI** (backend), **React** (frontend), **PostgreSQL** (database), and **Google Cloud Storage** (resume file storage).

---

## Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | React (Vite recommended) |
| Backend API | Python + FastAPI |
| Database | PostgreSQL |
| File Storage | Google Cloud Storage (GCS) |
| ORM | SQLAlchemy (async) |
| Migrations | Alembic |

---

## Database Schema

### `job_applications` Table

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` (PK) | Auto-generated |
| `company_name` | `VARCHAR(255)` | Required |
| `job_title` | `VARCHAR(255)` | Required |
| `job_description` | `TEXT` | Optional, full JD |
| `job_url` | `VARCHAR(500)` | Optional, link to posting |
| `resume_filename` | `VARCHAR(255)` | Original uploaded filename |
| `resume_gcs_url` | `VARCHAR(500)` | GCS object URL |
| `status` | `VARCHAR(50)` | Default: `Applied` |
| `notes` | `TEXT` | Optional, free-form notes |
| `applied_at` | `TIMESTAMP WITH TZ` | Auto-set on creation (`now()`) |
| `updated_at` | `TIMESTAMP WITH TZ` | Auto-updated on every modification |

#### Possible `status` values (as an enum or check constraint):
`Applied` → `Under Review` → `Interview Scheduled` → `Interviewed` → `Offer Received` → `Accepted` → `Rejected` → `Withdrawn`

---

## Project Structure

```
job-tracker/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + CORS setup
│   │   ├── config.py            # Settings (DB URL, GCS bucket, etc.)
│   │   ├── database.py          # SQLAlchemy engine + session
│   │   ├── models.py            # SQLAlchemy ORM models
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── routes/
│   │   │   └── applications.py  # All CRUD endpoints
│   │   └── services/
│   │       └── gcs.py           # Google Cloud Storage upload/download
│   ├── alembic/                 # DB migrations
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── ApplicationForm.jsx
│   │   │   ├── ApplicationList.jsx
│   │   │   ├── ApplicationCard.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── ApplicationDetail.jsx
│   │   └── services/
│   │       └── api.js           # Axios/fetch wrapper
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/applications` | Create a new application (multipart: JSON fields + resume file) |
| `GET` | `/api/applications` | List all applications (with optional filters & sorting) |
| `GET` | `/api/applications/{id}` | Get a single application's details |
| `PATCH` | `/api/applications/{id}/status` | Update status only |
| `PUT` | `/api/applications/{id}` | Update full application details |
| `DELETE` | `/api/applications/{id}` | Delete an application |
| `GET` | `/api/applications/{id}/resume` | Download/get a signed URL for the resume |

---

## Key Implementation Notes

### Backend (FastAPI)

1. **Auto Timestamps** — Use SQLAlchemy's `server_default=func.now()` for `applied_at` and `onupdate=func.now()` for `updated_at`. No manual date handling needed.
2. **Resume Upload Flow**:
   - Accept resume as `UploadFile` in the `POST` endpoint.
   - Upload to GCS bucket under a path like `resumes/{uuid}/{original_filename}`.
   - Store the GCS object URL in the database.
3. **GCS Integration** — Use `google-cloud-storage` Python SDK. Authenticate via a service account JSON key (set `GOOGLE_APPLICATION_CREDENTIALS` env var).
4. **CORS** — Add `CORSMiddleware` to allow requests from the React dev server.
5. **Validation** — Use Pydantic schemas to validate incoming data and serialize responses.

### Frontend (React)

1. **Application Form** — Use `FormData` to submit company details + resume file in a single `POST` request.
2. **Status Updates** — A dropdown or button group on each application card to quickly change status via `PATCH`.
3. **Application List** — Filterable by status, sortable by date. Consider a Kanban-style board for visual tracking.
4. **Resume Download** — Link/button that fetches a signed URL from the backend and opens it.

### Google Cloud Storage

1. **Create a GCS bucket** (e.g., `job-tracker-resumes`).
2. **Create a service account** with `Storage Object Admin` role.
3. **Download the JSON key** and set it as `GOOGLE_APPLICATION_CREDENTIALS`.
4. **Use signed URLs** for secure, time-limited resume downloads.

---

## Implementation Order (Recommended)

1. **Set up PostgreSQL** — Create the database and run the initial migration.
2. **Backend: Models + DB** — Define SQLAlchemy models, set up Alembic, run migration.
3. **Backend: CRUD endpoints** — Build the POST/GET/PATCH/DELETE routes.
4. **Backend: GCS integration** — Wire up resume upload and signed URL generation.
5. **Frontend: Scaffold** — Init Vite + React, set up routing.
6. **Frontend: Form + List** — Build the application form and list view.
7. **Frontend: Status + Detail** — Add status update controls and detail page.
8. **Polish** — Error handling, loading states, responsive design, and styling.

---

## Environment Variables

```env
# Backend .env
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/job_tracker
GCS_BUCKET_NAME=job-tracker-resumes
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
CORS_ORIGINS=http://localhost:5173
```

---

> [!TIP]
> **Quick Start Dependencies**
> - Backend: `fastapi`, `uvicorn`, `sqlalchemy[asyncio]`, `asyncpg`, `alembic`, `python-multipart`, `google-cloud-storage`, `python-dotenv`
> - Frontend: `react`, `react-router-dom`, `axios`
