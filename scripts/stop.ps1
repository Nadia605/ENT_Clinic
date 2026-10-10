$rootDir = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $rootDir

Write-Host "Stopping development environment..."
docker compose -f docker/docker-compose.yml down
Write-Host "Services stopped."
