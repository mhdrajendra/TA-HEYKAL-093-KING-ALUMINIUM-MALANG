@echo off
title Git Auto Push

cd /d "D:\YueMeM\Goes to TA\TA GIT\TA-HEYKAL-093-KING-ALUMINIUM-MALANG"

echo ====================================
echo Menambahkan perubahan...
echo ====================================
git add .

git diff --cached --quiet
if %errorlevel%==0 (
    echo.
    echo Tidak ada perubahan.
    pause
    exit
)

echo.
echo ====================================
echo Commit...
echo ====================================
git commit -m "Auto Backup"

echo.
echo ====================================
echo Mengambil update dari GitHub...
echo ====================================
git pull origin main --no-rebase

if %errorlevel% neq 0 (
    echo.
    echo ====================================
    echo GAGAL SAAT PULL!
    echo Selesaikan konflik terlebih dahulu.
    echo ====================================
    pause
    exit
)

echo.
echo ====================================
echo Push ke GitHub...
echo ====================================
git push origin main

if %errorlevel% neq 0 (
    echo.
    echo ====================================
    echo PUSH GAGAL!
    echo ====================================
    pause
    exit
)

echo.
echo ====================================
echo PUSH BERHASIL!
echo ====================================

pause