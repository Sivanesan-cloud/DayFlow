$ErrorActionPreference = 'Stop'
if (!(Test-Path server/.env)) { Copy-Item server/.env.example server/.env }
if (!(Test-Path client/.env)) { Copy-Item client/.env.example client/.env }
Write-Host 'Starting PostgreSQL...'
if (Get-Command docker -ErrorAction SilentlyContinue) {
  docker compose up -d postgres
} else {
  Write-Host 'Docker not found. Using the locally installed PostgreSQL service.'
}
Write-Host 'Installing server dependencies and seeding data...'
Push-Location server
try {
  npm.cmd install
  npm.cmd run seed
} finally {
  Pop-Location
}
Write-Host 'Dayflow database is ready.'
Write-Host 'Run the API with: cd server; npm.cmd start'
