# apps/web/deploy-azure.ps1
Param(
  [string]$Env     = 'production',   # SWA environment (production, preview, etc.)
  [string]$ApiBase = '',             # If provided, writes .env.production with this API base
  [string]$Token   = '',             # Optional: will override everything if passed
  [switch]$SkipBuild                 # Optional: skip local next build and let SWA do it
)

$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot  # run from apps/web

# ----------------- EMBEDDED FALLBACK TOKEN -----------------
# Order of precedence: Param > env var > .swa_token file > this fallback
# NOTE: rotate if ever compromised; avoid committing to public repos.
$FallbackToken = '7935fea84af68c79d2f7d3231cd9167634505ca26c3813211bf08f12c913bb2c02-b9748d06-0935-45b8-aa4f-617b717c033f01e00050ddd1ff1e'
# -----------------------------------------------------------

function Set-EnvFromFile($path) {
  if (-not (Test-Path $path)) { return $false }
  Write-Host "Loading env from $path" -ForegroundColor DarkCyan
  Get-Content $path | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
    $idx = $_.IndexOf('=')
    if ($idx -gt 0) {
      $key = $_.Substring(0, $idx).Trim()
      $val = $_.Substring($idx + 1).Trim()
      if (($val.StartsWith('"') -and $val.EndsWith('"')) -or ($val.StartsWith("'") -and $val.EndsWith("'"))) {
        $val = $val.Substring(1, $val.Length - 2)
      }
      [Environment]::SetEnvironmentVariable($key, $val, 'Process')
    }
  }
  return $true
}

# ------- env for build (client) -------
$env:NODE_ENV = 'production'

if ($ApiBase) {
  "NEXT_PUBLIC_API_BASE_URL=$ApiBase" | Out-File -FilePath ".env.production" -Encoding utf8
  Write-Host "Set NEXT_PUBLIC_API_BASE_URL for build: $ApiBase" -ForegroundColor Cyan
} else {
  $loaded = $false
  $loaded = $loaded -or (Set-EnvFromFile (Join-Path $PSScriptRoot '.env.production.local'))
  $loaded = $loaded -or (Set-EnvFromFile (Join-Path $PSScriptRoot '.env.production'))
  if (-not $loaded) {
    Write-Host "Warning: no .env.production(.local). Using .env.local for production build." -ForegroundColor Yellow
    Set-EnvFromFile (Join-Path $PSScriptRoot '.env.local') | Out-Null
  }
}

# ------- (optional) local build -------
if (-not $SkipBuild) {
  Write-Host "Building Next.js (SSR). You can pass -SkipBuild to let SWA build for you…" -ForegroundColor Cyan
  npm run build
}

# ------- resolve deploy token: Param > Env > .swa_token > Fallback -------
if (-not $Token) { $Token = $env:SWA_CLI_DEPLOYMENT_TOKEN }
if (-not $Token) {
  $tokenFile = Join-Path $PSScriptRoot '.swa_token'
  if (Test-Path $tokenFile) { $Token = (Get-Content $tokenFile -Raw).Trim() }
}
if (-not $Token) { $Token = $FallbackToken }  # <— baked in

# mask preview in console
$masked = if ($Token.Length -gt 12) { "{0}…{1}" -f $Token.Substring(0,6), $Token.Substring($Token.Length-4) } else { "****" }
Write-Host "Using SWA token: $masked" -ForegroundColor DarkGray

# ------- deploy (SSR: point to project root; SWA will detect Next.js) -------
Write-Host "Deploying Next.js SSR app to Azure Static Web Apps (env: $Env) …" -ForegroundColor Cyan
# Do NOT pass --output-location; let SWA detect Next/SSR
npx swa deploy --app-location "." --env $Env --deployment-token $Token
if ($LASTEXITCODE -ne 0) { throw "SWA deploy failed with exit code $LASTEXITCODE" }

Write-Host ""
Write-Host "Deployed successfully." -ForegroundColor Green
Write-Host "Open your site: https://everleap.demoland.site" -ForegroundColor Green
