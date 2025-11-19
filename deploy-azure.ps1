<#
Trigger GitHub Actions PROD deployment for Everleap Web (Static Web Apps)
-----------------------------------------------------------------------
Usage:
  .\delpoy-web.ps1 -CommitMessage "chore(web): deploy prod"

This script:
  • Runs from this folder (apps/web)
  • Updates .deploy-trigger (timestamp)
  • Commits + pushes to origin/main
  • GitHub Actions (deploy-web-prod.yml) handles the deploy
#>

param(
  [string]$Branch = "main",
  [string]$CommitMessage = "chore(web): deploy prod"
)

$ErrorActionPreference = "Stop"

function Step($m){ Write-Host "==> $m" -ForegroundColor Cyan }
function Ok($m){ Write-Host "✓ $m" -ForegroundColor Green }
function Err($m){ Write-Host "✗ $m" -ForegroundColor Red }

# 1) Verify git
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  Err "git not found. Please install Git first."
  exit 1
}

# 2) Confirm this is a Git repo
$repoRoot = (Get-Location).Path
if (-not (Test-Path (Join-Path $repoRoot ".git"))) {
  Err "This folder is not a Git repository."
  exit 1
}

# 3) Ensure correct branch
$currentBranch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($currentBranch -ne $Branch) {
  Step "Switching from $currentBranch to $Branch"
  git checkout $Branch | Out-Null
}

# 4) Pull latest
Step "Pulling latest from origin/$Branch"
git pull --ff-only origin $Branch | Out-Null

# 5) Write trigger file
$triggerFile = Join-Path $repoRoot ".deploy-trigger"
$timestamp = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss K")
"deploy-web prod triggered at $timestamp by $env:USERNAME" | Out-File -FilePath $triggerFile -Encoding UTF8
Ok "Updated .deploy-trigger"

# 6) Stage and commit
Step "Committing changes..."
git add .deploy-trigger | Out-Null
$fullMessage = "$CommitMessage — $timestamp"
try {
  git commit -m $fullMessage | Out-Null
  Ok "Committed: $fullMessage"
} catch {
  $status = git status --porcelain
  if ([string]::IsNullOrWhiteSpace($status)) {
    Ok "No changes to commit. Proceeding with push."
  } else {
    Err "Commit failed. Check Git hooks or config."
    exit 1
  }
}

# 7) Push
Step "Pushing to origin/$Branch..."
git push origin $Branch | Out-Null
Ok "Push successful. GitHub Actions will now deploy the web app."

Write-Host ""
Ok "✅ Web deployment triggered! Check your GitHub Actions → 'Deploy Everleap Web (PROD - Static Web Apps)'."
