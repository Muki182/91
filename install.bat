@echo off
echo ====================================
echo   安装2025男男性服务全档案系统
echo ====================================
echo.

echo 正在检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)

echo 正在安装依赖包...
npm install

if errorlevel 1 (
    echo 安装失败，请检查网络连接
    pause
    exit /b 1
)

echo.
echo ✅ 安装完成！
echo.
echo 启动方式:
echo 1. 双击 start.bat 启动生产服务器
echo 2. 双击 start-dev.bat 启动开发服务器
echo.
echo 访问地址: http://localhost:3000
echo.
pause