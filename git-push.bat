@echo off
cd /d "D:\Documents\Web Apps\Breed Industries Web App"
git add -A
git commit -m "Replace public-facing em dashes with hyphens in page.tsx and services/page.tsx"
git push origin main
echo.
echo Done! Press any key to close.
pause
