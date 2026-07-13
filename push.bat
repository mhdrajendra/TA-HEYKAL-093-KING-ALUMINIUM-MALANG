@echo off
title Git Auto Push

cd /d "D:\YueMeM\Goes to TA\TA GIT\TA-HEYKAL-093-KING-ALUMINIUM-MALANG"

git add .

git diff --cached --quiet
if %errorlevel%==0 (
    echo Tidak ada perubahan.
    pause
    exit
)

git commit -m "Auto Backup"

git push

echo.
echo ============================
echo Push berhasil!
echo ============================

pause