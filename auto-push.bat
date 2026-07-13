@echo off
title Git Auto Push

cd /d "D:\YueMeM\Goes to TA\TA GIT\TA-HEYKAL-093-KING-ALUMINIUM-MALANG"

git add .

git diff --cached --quiet
if %errorlevel%==0 (
    exit
)

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format \"yyyy-MM-dd HH:mm:ss\""') do set DATETIME=%%i

git commit -m "Auto Backup %DATETIME%"
git push

exit