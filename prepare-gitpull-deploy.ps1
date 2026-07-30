param(
  [string]$SourceBuild = ".builds/last-source/build",
  [string]$TargetRoot = "."
)

$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$src = Join-Path $repoRoot $SourceBuild
$dst = Join-Path $repoRoot $TargetRoot

if (!(Test-Path $src)) {
  throw "Build folder not found: $src"
}

Write-Host "Syncing build -> repo root for git-pull deploy..."
Write-Host "Source: $src"
Write-Host "Target: $dst"

$items = @(
  "index.html",
  "asset-manifest.json",
  "manifest.json",
  "favicon.ico",
  "favicon-uw.png",
  "site.webmanifest",
  "_redirects",
  ".htaccess",
  "script.js",
  "static"
)

foreach ($item in $items) {
  $srcPath = Join-Path $src $item
  $dstPath = Join-Path $dst $item

  if (Test-Path $srcPath) {
    if (Test-Path $dstPath) {
      Remove-Item $dstPath -Recurse -Force
    }
    Copy-Item $srcPath $dstPath -Recurse -Force
    Write-Host "Updated: $item"
  } else {
    Write-Host "Skipped (missing in build): $item"
  }
}

Write-Host ""
Write-Host "Done."
Write-Host "Next steps:"
Write-Host "1) git add index.html asset-manifest.json static manifest.json site.webmanifest _redirects .htaccess favicon.ico favicon-uw.png script.js"
Write-Host "2) git commit -m 'deploy: sync frontend build for live'"
Write-Host "3) git push"
Write-Host "4) Live server: git pull"
