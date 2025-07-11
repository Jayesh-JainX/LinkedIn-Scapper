#!/bin/bash

# LinkedIn Research Tool Setup Script
# This script automates the setup process for the LinkedIn scraper

set -e

echo "🚀 LinkedIn Research Tool Setup"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    print_warning "Windows detected. Some features may require WSL or Docker."
fi

# Check prerequisites
print_status "Checking prerequisites..."

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_success "Python $PYTHON_VERSION found"
else
    print_error "Python 3.8+ is required but not installed"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js $NODE_VERSION found"
else
    print_error "Node.js 18+ is required but not installed"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm $NPM_VERSION found"
else
    print_error "npm is required but not installed"
    exit 1
fi

# Check Docker (optional)
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version | cut -d' ' -f3 | cut -d',' -f1)
    print_success "Docker $DOCKER_VERSION found"
    DOCKER_AVAILABLE=true
else
    print_warning "Docker not found. You can still run the application locally."
    DOCKER_AVAILABLE=false
fi

# Check Chrome (for Selenium)
if command -v google-chrome &> /dev/null || command -v chrome &> /dev/null; then
    print_success "Chrome browser found"
else
    print_warning "Chrome browser not found. Selenium scraping may not work."
fi

echo ""
print_status "Setting up backend..."

# Backend setup
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    print_status "Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
print_status "Activating virtual environment..."
source venv/bin/activate

# Install Python dependencies
print_status "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create environment file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating environment file..."
    cp env_template.txt .env
    print_warning "Please edit backend/.env with your LinkedIn credentials and other settings"
else
    print_success "Environment file already exists"
fi

# Create database directory
mkdir -p data

cd ..

echo ""
print_status "Setting up frontend..."

# Frontend setup
cd frontend

# Install Node.js dependencies
print_status "Installing Node.js dependencies..."
npm install

# Create environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    print_status "Creating frontend environment file..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
    print_success "Frontend environment file created"
else
    print_success "Frontend environment file already exists"
fi

cd ..

echo ""
print_status "Creating startup scripts..."

# Create startup scripts
cat > start-backend.sh << 'EOF'
#!/bin/bash
cd backend
source venv/bin/activate
python run.py
EOF

cat > start-frontend.sh << 'EOF'
#!/bin/bash
cd frontend
npm run dev
EOF

cat > start-all.sh << 'EOF'
#!/bin/bash
# Start backend in background
./start-backend.sh &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 5

# Start frontend
./start-frontend.sh &
FRONTEND_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "Shutting down services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
EOF

# Make scripts executable
chmod +x start-backend.sh start-frontend.sh start-all.sh

print_success "Startup scripts created"

echo ""
print_status "Setup complete! 🎉"

echo ""
echo "📋 Next Steps:"
echo "=============="
echo "1. Edit backend/.env with your LinkedIn credentials:"
echo "   - LINKEDIN_EMAIL=your_email@example.com"
echo "   - LINKEDIN_PASSWORD=your_password"
echo "   - OPENAI_API_KEY=your_openai_key (optional)"
echo ""
echo "2. Start the application:"
echo "   - Run both: ./start-all.sh"
echo "   - Backend only: ./start-backend.sh"
echo "   - Frontend only: ./start-frontend.sh"
echo ""
echo "3. Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Docs: http://localhost:8000/docs"
echo ""

if [ "$DOCKER_AVAILABLE" = true ]; then
    echo "🐳 Docker Alternative:"
    echo "====================="
    echo "You can also run the application using Docker:"
    echo "1. Edit backend/.env with your credentials"
    echo "2. Run: docker-compose up -d"
    echo "3. Access: http://localhost:3000"
    echo ""
fi

echo "📚 Documentation:"
echo "================="
echo "See README.md for detailed usage instructions and troubleshooting."
echo ""
echo "⚠️  Important Notes:"
echo "==================="
echo "- Ensure you comply with LinkedIn's Terms of Service"
echo "- Use this tool for legitimate business research only"
echo "- The tool includes rate limiting to avoid LinkedIn restrictions"
echo ""

print_success "Setup completed successfully!" 