#!/bin/bash

# LinkedIn Scraper Docker Runner Script

echo "🚀 LinkedIn Scraper Docker Setup"
echo "=================================="

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
    echo "✅ Docker is running"
}

# Function to build and start services
start_services() {
    echo "🔨 Building and starting services..."
    docker-compose up --build -d
    
    if [ $? -eq 0 ]; then
        echo "✅ Services started successfully!"
        echo ""
        echo "📱 Access your applications:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend:  http://localhost:8000"
        echo "   Health:   http://localhost:8000/health"
        echo ""
        echo "📋 Useful commands:"
        echo "   View logs:     docker-compose logs -f"
        echo "   Stop services: docker-compose down"
        echo "   Restart:       docker-compose restart"
    else
        echo "❌ Failed to start services"
        exit 1
    fi
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping services..."
    docker-compose down
    echo "✅ Services stopped"
}

# Function to show logs
show_logs() {
    echo "📋 Showing logs (Press Ctrl+C to exit)..."
    docker-compose logs -f
}

# Function to show status
show_status() {
    echo "📊 Service Status:"
    docker-compose ps
}

# Function to clean up
cleanup() {
    echo "🧹 Cleaning up Docker resources..."
    docker-compose down -v --rmi all
    docker system prune -f
    echo "✅ Cleanup completed"
}

# Main script logic
case "$1" in
    "start")
        check_docker
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        start_services
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "cleanup")
        cleanup
        ;;
    "build")
        echo "🔨 Building services..."
        docker-compose build
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|status|cleanup|build}"
        echo ""
        echo "Commands:"
        echo "  start   - Build and start all services"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - Show service logs"
        echo "  status  - Show service status"
        echo "  cleanup - Clean up Docker resources"
        echo "  build   - Build services without starting"
        echo ""
        echo "Examples:"
        echo "  $0 start    # Start the application"
        echo "  $0 logs     # View logs"
        echo "  $0 stop     # Stop the application"
        exit 1
        ;;
esac 