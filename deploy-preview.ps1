Param(
  [int]$Port = 4321
)

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

# Show env baked into the build (handy sanity check)
$envFile = Join-Path $PSScriptRoot '.env.local'
if (Test-Path $envFile) {
  Write-Host "Using .env.local values:" -ForegroundColor DarkCyan
  Get-Content $envFile
}

Write-Host "Building static export (out/) ..." -ForegroundColor Cyan
npm run build

Write-Host "Serving out/ at http://localhost:$Port ..." -ForegroundColor Cyan
npx serve -s out -l $Port
