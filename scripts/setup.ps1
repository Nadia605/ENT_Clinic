# Check for Docker Desktop
Write-Host "Checking for Docker..."
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker is not installed or not in PATH. Please install Docker Desktop with WSL2."
    exit 1
}

$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $rootDir

# Copy .env.example to .env
if (-not (Test-Path .env)) {
    Write-Host "Creating .env from .env.example..."
    Copy-Item .env.example .env
}

# Run docker compose
Write-Host "Starting Docker services..."
docker compose -f docker/docker-compose.yml up -d --build

Write-Host "Waiting for services to be healthy..."
Start-Sleep -Seconds 15

# Run migrations and seed
Write-Host "Running migrations..."
docker compose -f docker/docker-compose.yml exec backend alembic upgrade head

Write-Host "Running seed script..."
docker compose -f docker/docker-compose.yml exec backend python -m app.scripts.seed

Write-Host "`nSetup complete! Services are running:`n"
Write-Host "Frontend:      http://localhost:3000"
Write-Host "Backend API:   http://localhost:8000"
Write-Host "API Docs:      http://localhost:8000/docs"
Write-Host "MinIO Console: http://localhost:9001 (minioadmin / minioadmin)"
