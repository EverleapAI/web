param(
  [string]$ApiBase = "https://everleapfunctionsdev-f5hbadhre9c8eqha.westus-01.azurewebsites.net/api",
  [switch]$Install
)

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot  # run from apps/web

if ($Install) { npm ci }

"NEXT_PUBLIC_API_BASE_URL=$ApiBase" | Out-File -FilePath ".env.local" -Encoding utf8

Write-Host "Using API base: $ApiBase" -ForegroundColor Cyan
Write-Host "Starting Next.js dev server at http://localhost:3000 ..." -ForegroundColor Cyan
npm run dev
