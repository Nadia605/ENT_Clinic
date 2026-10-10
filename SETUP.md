# AuraENT Setup Guide (Windows)

This document explains how to set up the AuraENT project locally on a Windows machine.

## Prerequisites

Ensure you have the following installed:
- **Docker Desktop**: Must be installed with the WSL2 backend enabled.
- **Node.js**: Version 20 or higher.
- **Python**: Version 3.11 or higher.
- **Git**: To clone the repository.

### Docker Desktop WSL2 Setup
1. Install Docker Desktop for Windows.
2. Go to Docker Desktop Settings (Gear icon) -> **General**.
3. Check "Use the WSL 2 based engine".
4. Go to **Resources -> WSL Integration** and enable it for your default WSL distribution.
5. Apply & Restart.

## Initial Setup

1. Open PowerShell and clone the repository:
   ```powershell
   git clone <repository_url> C:\Users\nadia\Projects\auraent
   cd C:\Users\nadia\Projects\auraent
   ```

2. Run the automated setup script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts\setup.ps1
   ```
   This script will:
   - Copy `.env.example` to `.env`
   - Build and start all Docker services
   - Run database migrations
   - Seed the database with initial data

## Running the Application

### Start Development
To start the services for daily development:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\dev.ps1
```

### Stop Services
To shut down the running containers:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\stop.ps1
```

### Reset Database
If you need to wipe all local data and re-seed the database:
```powershell
powershell -ExecutionPolicy Bypass -File scripts\reset-db.ps1
```

## Service URLs

Once running, access the services at:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| MinIO Console | http://localhost:9001 |

## Demo Credentials
- **MinIO Admin**: `minioadmin` / `minioadmin`
*(Note: Consult your team's seed script data for initial app login credentials.)*

## Troubleshooting

- **Containers failing to start?**
  Ensure Docker Desktop is running and WSL2 is properly configured.
- **Database connection issues?**
  Try running the `scripts\reset-db.ps1` script to clear out any corrupted state.
- **Powershell script blocked?**
  Ensure you are using `-ExecutionPolicy Bypass` when executing scripts, or change your execution policy globally.
