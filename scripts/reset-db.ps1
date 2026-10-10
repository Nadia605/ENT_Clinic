$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $rootDir

Write-Host "Warning: This will destroy all local database data!"
$confirm = Read-Host "Are you sure? (y/n)"
if ($confirm -ne 'y') { exit }

Write-Host "Stopping services and removing volumes..."
docker compose -f docker/docker-compose.yml down -v

Write-Host "Starting backing services..."
docker compose -f docker/docker-compose.yml up -d db redis minio

Write-Host "Waiting for database to be ready..."
Start-Sleep -Seconds 10

Write-Host "Running migrations..."
docker compose -f docker/docker-compose.yml run --rm backend alembic upgrade head

Write-Host "Running seed script..."
docker compose -f docker/docker-compose.yml run --rm backend python -m app.scripts.seed

Write-Host "Starting remaining services..."
docker compose -f docker/docker-compose.yml up -d

Write-Host "Database reset complete."
