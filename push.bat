@echo off
echo.
echo  Breed Industries — Git Push
echo  ============================
echo.

cd /d "%~dp0"

git add .

set /p msg=Commit message:
if "%msg%"=="" set msg=update

git commit -m "%msg%"
git push

echo.
echo  Done!
pause
