@echo off
setlocal enabledelayedexpansion

echo 🚀 LinkedIn Research Tool Setup
echo ================================

REM Check prerequisites
echo [INFO] Checking prerequisites...

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python 3.8+ is required but not installed
    pause
    exit /b 1
) else (
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
    echo [SUCCESS] Python !PYTHON_VERSION! found
)

REM Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js 18+ is required but not installed
    pause
    exit /b 1
) else (
    for /f %%i in ('node --version') do set NODE_VERSION=%%i
    echo [SUCCESS] Node.js !NODE_VERSION! found
)

REM Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is required but not installed
    pause
    exit /b 1
) else (
    for /f %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [SUCCESS] npm !NPM_VERSION! found
)

REM Check Docker (optional)
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Docker not found. You can still run the application locally.
    set DOCKER_AVAILABLE=false
) else (
    for /f "tokens=3" %%i in ('docker --version') do set DOCKER_VERSION=%%i
    echo [SUCCESS] Docker !DOCKER_VERSION! found
    set DOCKER_AVAILABLE=true
)

echo.
echo [INFO] Setting up backend...

REM Backend setup
cd backend

REM Create virtual environment
if not exist "venv" (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo [INFO] Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Create environment file if it doesn't exist
if not exist ".env" (
    echo [INFO] Creating environment file...
    copy env_template.txt .env
    echo [WARNING] Please edit backend\.env with your LinkedIn credentials and other settings
) else (
    echo [SUCCESS] Environment file already exists
)

REM Create database directory
if not exist "data" mkdir data

cd ..

echo.
echo [INFO] Setting up frontend...

REM Frontend setup
cd frontend

REM Install Node.js dependencies
echo [INFO] Installing Node.js dependencies...
npm install

REM Create environment file if it doesn't exist
if not exist ".env.local" (
    echo [INFO] Creating frontend environment file...
    echo NEXT_PUBLIC_API_URL=http://localhost:8000/api > .env.local
    echo [SUCCESS] Frontend environment file created
) else (
    echo [SUCCESS] Frontend environment file already exists
)

cd ..

echo.
echo [INFO] Creating startup scripts...

REM Create startup scripts
echo @echo off > start-backend.bat
echo cd backend >> start-backend.bat
echo call venv\Scripts\activate.bat >> start-backend.bat
echo python run.py >> start-backend.bat

echo @echo off > start-frontend.bat
echo cd frontend >> start-frontend.bat
echo npm run dev >> start-frontend.bat

echo @echo off > start-all.bat
echo echo Starting LinkedIn Research Tool... >> start-all.bat
echo echo. >> start-all.bat
echo echo Starting backend... >> start-all.bat
echo start "Backend" cmd /k "cd backend ^& call venv\Scripts\activate.bat ^& python run.py" >> start-all.bat
echo timeout /t 5 /nobreak ^>nul >> start-all.bat
echo echo Starting frontend... >> start-all.bat
echo start "Frontend" cmd /k "cd frontend ^& npm run dev" >> start-all.bat
echo echo. >> start-all.bat
echo echo Application started! >> start-all.bat
echo echo Frontend: http://localhost:3000 >> start-all.bat
echo echo Backend: http://localhost:8000 >> start-all.bat
echo echo. >> start-all.bat
echo pause >> start-all.bat

echo [SUCCESS] Startup scripts created

echo.
echo [SUCCESS] Setup complete! 🎉

echo.
echo 📋 Next Steps:
echo ==============
echo 1. Edit backend\.env with your LinkedIn credentials:
echo    - LINKEDIN_EMAIL=your_email@example.com
echo    - LINKEDIN_PASSWORD=your_password
echo    - OPENAI_API_KEY=your_openai_key (optional)
echo.
echo 2. Start the application:
echo    - Run both: start-all.bat
echo    - Backend only: start-backend.bat
echo    - Frontend only: start-frontend.bat
echo.
echo 3. Access the application:
echo    - Frontend: http://localhost:3000
echo    - Backend API: http://localhost:8000
echo    - API Docs: http://localhost:8000/docs
echo.

if "%DOCKER_AVAILABLE%"=="true" (
    echo 🐳 Docker Alternative:
    echo =====================
    echo You can also run the application using Docker:
    echo 1. Edit backend\.env with your credentials
    echo 2. Run: docker-compose up -d
    echo 3. Access: http://localhost:3000
    echo.
)

echo 📚 Documentation:
echo =================
echo See README.md for detailed usage instructions and troubleshooting.
echo.
echo ⚠️  Important Notes:
echo ===================
echo - Ensure you comply with LinkedIn's Terms of Service
echo - Use this tool for legitimate business research only
echo - The tool includes rate limiting to avoid LinkedIn restrictions
echo.

echo [SUCCESS] Setup completed successfully!
pause 