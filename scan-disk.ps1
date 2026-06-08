# Breed Industries — Disk Space Scanner
# Run: Right-click this file → Run with PowerShell

Write-Host "`n=== TOP SPACE USERS ===" -ForegroundColor Cyan

$folders = @(
    "C:\Users\newbr\Documents",
    "C:\Users\newbr\Downloads",
    "C:\Users\newbr\Videos",
    "C:\Users\newbr\Pictures",
    "C:\Users\newbr\AppData\Local",
    "C:\Users\newbr\AppData\Roaming",
    "C:\Users\newbr\AppData\Local\Docker",
    "C:\Users\newbr\AppData\Local\npm-cache",
    "C:\Windows\Temp",
    "C:\Users\newbr\AppData\Local\Temp"
)

foreach ($folder in $folders) {
    if (Test-Path $folder) {
        $size = (Get-ChildItem $folder -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        $gb = [math]::Round($size / 1GB, 2)
        if ($gb -gt 0.5) {
            $color = if ($gb -gt 10) { "Red" } elseif ($gb -gt 3) { "Yellow" } else { "Green" }
            Write-Host ("{0,-60} {1,6} GB" -f $folder, $gb) -ForegroundColor $color
        }
    }
}

Write-Host "`n=== node_modules FOLDERS ===" -ForegroundColor Cyan
Get-ChildItem "C:\Users\newbr" -Recurse -Force -Directory -Filter "node_modules" -ErrorAction SilentlyContinue | ForEach-Object {
    $size = (Get-ChildItem $_.FullName -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    $gb = [math]::Round($size / 1GB, 2)
    Write-Host ("{0,-70} {1,6} GB" -f $_.FullName, $gb) -ForegroundColor Red
}

Write-Host "`n=== Docker Images ===" -ForegroundColor Cyan
try { docker system df 2>$null } catch { Write-Host "Docker not running or not installed" }

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
