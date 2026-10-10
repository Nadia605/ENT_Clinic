$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $rootDir

Write-Host "Starting development environment..."
docker compose -f docker/docker-compose.yml up -d

Write-Host "`nServices started! URLs:`n"
Write-Host "Frontend:      http://localhost:3000"
Write-Host "Backend API:   http://localhost:8000"
Write-Host "API Docs:      http://localhost:8000/docs"
Write-Host "MinIO Console: http://localhost:9001"
