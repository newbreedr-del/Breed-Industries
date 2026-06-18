@echo off
echo.
echo  Breed Industries — Git Push
echo  ============================
echo.

cd /d "C:\Users\newbr\Documents\Web Apps\Breed Industries Web App"

echo Working directory:
cd
echo.

git init 2>nul

git remote remove origin 2>nul
git remote add origin https://github.com/newbreedr-del/Breed-Industries.git

echo Files changed:
git status --short
echo.

git add -A

set /p msg=Commit message (or press Enter for "update"):
if "%msg%"=="" set msg=update

git commit -m "%msg%"

git branch -M main
git push -u origin main --force

echo.
echo  Done!
pause
