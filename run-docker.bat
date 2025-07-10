@echo off
setlocal enabledelayedexpansion

echo 🚀 LinkedIn Scraper Docker Setup
echo ==================================

REM Function to check if Docker is running
:check_docker
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)
echo ✅ Docker is running
goto :eof

REM Function to build and start services
:start_services
echo 🔨 Building and starting services...
docker-compose up --build -d
if %errorlevel% equ 0 (
    echo ✅ Services started successfully!
    echo.
    echo 📱 Access your applications:
    echo    Frontend: http://localhost:3000
    echo    Backend:  http://localhost:8000
    echo    Health:   http://localhost:8000/health
    echo.
    echo 📋 Useful commands:
    echo    View logs:     docker-compose logs -f
    echo    Stop services: docker-compose down
    echo    Restart:       docker-compose restart
) else (
    echo ❌ Failed to start services
    exit /b 1
)
goto :eof

REM Function to stop services
:stop_services
echo 🛑 Stopping services...
docker-compose down
echo ✅ Services stopped
goto :eof

REM Function to show logs
:show_logs
echo 📋 Showing logs (Press Ctrl+C to exit)...
docker-compose logs -f
goto :eof

REM Function to show status
:show_status
echo 📊 Service Status:
docker-compose ps
goto :eof

REM Function to clean up
:cleanup
echo 🧹 Cleaning up Docker resources...
docker-compose down -v --rmi all
docker system prune -f
echo ✅ Cleanup completed
goto :eof

REM Main script logic
if "%1"=="start" (
    call :check_docker
    call :start_services
    goto :eof
)

if "%1"=="stop" (
    call :stop_services
    goto :eof
)

if "%1"=="restart" (
    call :stop_services
    call :start_services
    goto :eof
)

if "%1"=="logs" (
    call :show_logs
    goto :eof
)

if "%1"=="status" (
    call :show_status
    goto :eof
)

if "%1"=="cleanup" (
    call :cleanup
    goto :eof
)

if "%1"=="build" (
    echo 🔨 Building services...
    docker-compose build
    goto :eof
)

REM Default help message
echo Usage: %0 {start^|stop^|restart^|logs^|status^|cleanup^|build}
echo.
echo Commands:
echo   start   - Build and start all services
echo   stop    - Stop all services
echo   restart - Restart all services
echo   logs    - Show service logs
echo   status  - Show service status
echo   cleanup - Clean up Docker resources
echo   build   - Build services without starting
echo.
echo Examples:
echo   %0 start    # Start the application
echo   %0 logs     # View logs
echo   %0 stop     # Stop the application
exit /b 1 