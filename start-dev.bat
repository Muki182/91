@echo off
echo ====================================
echo   2025男男性服务全档案系统
echo         开发模式 v2.0.0
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

echo 正在检查依赖包...
if not exist "node_modules" (
    echo 首次运行，正在安装依赖...
    npm install
    if errorlevel 1 (
        echo 依赖安装失败，请检查网络连接
        pause
        exit /b 1
    )
)

echo.
echo 启动开发服务器...
echo 访问地址: http://localhost:3000
echo.

npm run dev