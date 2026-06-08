# =====================================================
# Breed Industries — Full Disk Cleanup & Organizer
# Right-click this file → Run as administrator
# =====================================================

$Host.UI.RawUI.WindowTitle = "Breed Industries Disk Cleanup"
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "   BREED INDUSTRIES — DISK CLEANUP TOOL" -ForegroundColor Cyan
Write-Host "================================================`n" -ForegroundColor Cyan

# ── Step 1: Show disk space ──────────────────────────
$drive = Get-PSDrive C
$freeMB = [math]::Round($drive.Free / 1MB, 0)
$totalGB = [math]::Round(($drive.Used + $drive.Free) / 1GB, 1)
$usedGB = [math]::Round($drive.Used / 1GB, 1)
Write-Host "DISK STATUS: $usedGB GB used / $totalGB GB total / $freeMB MB FREE" -ForegroundColor $(if ($freeMB -lt 1000) { "Red" } else { "Green" })
Write-Host ""

# ── Step 2: Find node_modules folders ───────────────
Write-Host "Scanning for node_modules folders..." -ForegroundColor Yellow
$nodeFolders = Get-ChildItem "C:\Users\newbr" -Recurse -Force -Directory -Filter "node_modules" -ErrorAction SilentlyContinue
$totalNodeGB = 0
Write-Host "`n[node_modules folders found]" -ForegroundColor Cyan
foreach ($f in $nodeFolders) {
    $size = (Get-ChildItem $f.FullName -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $gb = [math]::Round($size / 1GB, 2)
    $totalNodeGB += $gb
    Write-Host ("  {0,-65} {1,6} GB" -f $f.FullName, $gb) -ForegroundColor Red
}
Write-Host "  TOTAL node_modules: $totalNodeGB GB" -ForegroundColor Yellow

# ── Step 3: Find .next build folders ────────────────
Write-Host "`n[.next build folders found]" -ForegroundColor Cyan
$nextFolders = Get-ChildItem "C:\Users\newbr" -Recurse -Force -Directory -Filter ".next" -ErrorAction SilentlyContinue
$totalNextGB = 0
foreach ($f in $nextFolders) {
    $size = (Get-ChildItem $f.FullName -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $gb = [math]::Round($size / 1GB, 2)
    $totalNextGB += $gb
    Write-Host ("  {0,-65} {1,6} GB" -f $f.FullName, $gb) -ForegroundColor Magenta
}
Write-Host "  TOTAL .next: $totalNextGB GB" -ForegroundColor Yellow

# ── Step 4: Check npm cache ──────────────────────────
Write-Host "`n[npm/yarn/pnpm cache]" -ForegroundColor Cyan
$caches = @(
    "$env:APPDATA\npm-cache",
    "$env:LOCALAPPDATA\npm-cache",
    "$env:LOCALAPPDATA\Yarn\Cache",
    "$env:LOCALAPPDATA\pnpm\store"
)
$totalCacheGB = 0
foreach ($c in $caches) {
    if (Test-Path $c) {
        $size = (Get-ChildItem $c -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $gb = [math]::Round($size / 1GB, 2)
        $totalCacheGB += $gb
        Write-Host ("  {0,-65} {1,6} GB" -f $c, $gb) -ForegroundColor DarkYellow
    }
}
Write-Host "  TOTAL caches: $totalCacheGB GB" -ForegroundColor Yellow

# ── Step 5: Check Windows Temp ──────────────────────
Write-Host "`n[Windows Temp folders]" -ForegroundColor Cyan
$temps = @("$env:TEMP", "C:\Windows\Temp")
$totalTempGB = 0
foreach ($t in $temps) {
    if (Test-Path $t) {
        $size = (Get-ChildItem $t -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $gb = [math]::Round($size / 1GB, 2)
        $totalTempGB += $gb
        Write-Host ("  {0,-65} {1,6} GB" -f $t, $gb) -ForegroundColor DarkGray
    }
}
Write-Host "  TOTAL temp: $totalTempGB GB" -ForegroundColor Yellow

# ── Step 6: Check AppData ────────────────────────────
Write-Host "`n[Large AppData folders]" -ForegroundColor Cyan
$appDataFolders = Get-ChildItem "$env:LOCALAPPDATA" -Directory -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -in @("Docker","Google","Microsoft","BraveSoftware","Slack","Discord","Spotify","Adobe","JetBrains") }
foreach ($f in $appDataFolders) {
    $size = (Get-ChildItem $f.FullName -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $gb = [math]::Round($size / 1GB, 2)
    if ($gb -gt 0.5) {
        Write-Host ("  {0,-65} {1,6} GB" -f $f.FullName, $gb) -ForegroundColor DarkCyan
    }
}

# ── Step 7: Summary & cleanup prompt ────────────────
$totalRecoverable = $totalNodeGB + $totalNextGB + $totalCacheGB + $totalTempGB
Write-Host "`n================================================" -ForegroundColor Green
Write-Host "  RECOVERABLE SPACE: ~$totalRecoverable GB" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

Write-Host "`nWhat do you want to clean? (Enter numbers separated by commas)" -ForegroundColor White
Write-Host "  1. Delete ALL node_modules folders ($totalNodeGB GB)" -ForegroundColor Red
Write-Host "  2. Delete ALL .next build folders ($totalNextGB GB)" -ForegroundColor Magenta
Write-Host "  3. Clear npm/yarn cache ($totalCacheGB GB)" -ForegroundColor DarkYellow
Write-Host "  4. Clear Windows Temp ($totalTempGB GB)" -ForegroundColor DarkGray
Write-Host "  5. ALL OF THE ABOVE" -ForegroundColor Yellow
Write-Host "  0. Exit without deleting anything`n" -ForegroundColor Gray

$choice = Read-Host "Your choice"

if ($choice -match "5|all") { $choices = @("1","2","3","4") }
else { $choices = $choice -split "," | ForEach-Object { $_.Trim() } }

if ("1" -in $choices) {
    Write-Host "`nDeleting node_modules folders..." -ForegroundColor Red
    foreach ($f in $nodeFolders) {
        Write-Host "  Removing: $($f.FullName)" -ForegroundColor DarkRed
        Remove-Item $f.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }
    Write-Host "  Done." -ForegroundColor Green
}

if ("2" -in $choices) {
    Write-Host "`nDeleting .next build folders..." -ForegroundColor Magenta
    foreach ($f in $nextFolders) {
        Write-Host "  Removing: $($f.FullName)" -ForegroundColor DarkMagenta
        Remove-Item $f.FullName -Recurse -Force -ErrorAction SilentlyContinue
    }
    Write-Host "  Done." -ForegroundColor Green
}

if ("3" -in $choices) {
    Write-Host "`nClearing npm/yarn/pnpm cache..." -ForegroundColor DarkYellow
    foreach ($c in $caches) {
        if (Test-Path $c) {
            Remove-Item "$c\*" -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "  Cleared: $c" -ForegroundColor Green
        }
    }
}

if ("4" -in $choices) {
    Write-Host "`nClearing Windows Temp..." -ForegroundColor DarkGray
    Remove-Item "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item "C:\Windows\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  Done." -ForegroundColor Green
}

# ── Final disk check ─────────────────────────────────
$drive2 = Get-PSDrive C
$freeMB2 = [math]::Round($drive2.Free / 1MB, 0)
$freedMB = $freeMB2 - $freeMB
Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "  BEFORE: $freeMB MB free" -ForegroundColor White
Write-Host "  AFTER:  $freeMB2 MB free" -ForegroundColor Green
Write-Host "  FREED:  $freedMB MB" -ForegroundColor Yellow
Write-Host "================================================`n" -ForegroundColor Cyan

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
