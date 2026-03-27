$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
Set-Location $repoRoot

Write-Host '==> Building project'
npm run build:all
if ($LASTEXITCODE -ne 0) {
  throw "Build failed with exit code $LASTEXITCODE."
}

Write-Host '==> Creating npm package'
$packageFile = (npm pack | Select-Object -Last 1).Trim()
if ($LASTEXITCODE -ne 0) {
  throw "npm pack failed with exit code $LASTEXITCODE."
}

$packagePath = Join-Path $repoRoot $packageFile
Write-Host "==> Package ready: $packagePath"
