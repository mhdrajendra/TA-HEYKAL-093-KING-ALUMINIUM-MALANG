@echo off
title Git Push

cd /d "D:\YueMeM\Goes to TA\TA GIT\TA-HEYKAL-093-KING-ALUMINIUM-MALANG"

git add .

git diff --cached --quiet
if %errorlevel%==0 (
    echo Tidak ada perubahan.
    pause
    exit
)

set /p MESSAGE=Masukkan pesan commit: 

if "%MESSAGE%"=="" (
    set MESSAGE=Auto Backup
)

git commit -m "%MESSAGE%"

git pull origin main --no-rebase

if %errorlevel% neq 0 (
    echo Gagal saat pull.
    pause
    exit
)

git push origin main

if %errorlevel% neq 0 (
    echo Gagal saat push.
    pause
    exit
)

echo.
echo =====================================
echo Push berhasil!
echo =====================================

pause