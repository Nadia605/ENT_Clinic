# Mohamed Khalil ENT Clinic — Clinic Operating System

> عيادة محمد خليل للأنف والأذن والحنجرة

A modern, bilingual (Arabic + English) clinic management system built for Dr. Mohamed Khalil's ENT practice.

*AuraENT* is the internal product/codebase name. Patients and staff see the clinic's real name.

## Quick Start (Windows)

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) with WSL2 backend
- [Node.js 20+](https://nodejs.org/)
- [Python 3.11+](https://www.python.org/)
- [Git](https://git-scm.com/)

### Setup

```powershell
# Clone the repo (or cd into the project)
cd C:\Users\nadia\Projects\auraent

# Run the setup script
powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
```

### Service URLs

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| MinIO Console | http://localhost:9001 |

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Doctor | doctor@auraent.local | doctor123 |
| Receptionist | receptionist@auraent.local | reception123 |
| Assistant | assistant@auraent.local | assistant123 |
| Patient | patient@auraent.local | patient123 |

## Architecture

```
User Device (Browser)
        ↓
  Next.js 15 Frontend (port 3000)
        ↓ REST API + WebSocket
  FastAPI Backend (port 8000)
        ↓
  ┌─────────────┬──────────┬──────────┐
  PostgreSQL 16   Redis 7    MinIO
  (structured     (cache,    (medical
   data)          pub/sub,    images,
                  jobs)       files)
```

See [docs/architecture.md](docs/architecture.md) for full details.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, Tailwind CSS v4, next-intl |
| Backend | FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2 |
| Database | PostgreSQL 16 |
| File Storage | MinIO (S3-compatible) |
| Cache/PubSub | Redis 7 |
| Background Jobs | Celery with Redis broker |
| Containerization | Docker Compose |

## Roles

| Role | Access |
|---|---|
| Doctor | Full clinical + management + administration |
| Receptionist | Appointments, billing, patient registration, queue |
| Assistant | Vitals, media, intake, room turnover, equipment, inventory |
| Patient | Own appointments, intake, prescriptions, invoices |

## License

Private — Mohamed Khalil ENT Clinic. All rights reserved.
