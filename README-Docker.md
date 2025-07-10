# LinkedIn Scraper - Docker Setup

This document provides instructions for running the LinkedIn Scraper project using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed on your system

## Project Structure

```
LinkedIn-Scapper/
├── frontend/          # Next.js frontend application
├── backend/           # FastAPI backend application
├── docker-compose.yml # Docker Compose configuration
├── .dockerignore      # Docker ignore file
└── README-Docker.md   # This file
```

## Quick Start

### 1. Build and Run All Services

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode (background)
docker-compose up --build -d
```

### 2. Access the Applications

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Backend Health Check**: http://localhost:8000/health

### 3. View Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f
```

## Individual Service Commands

### Frontend Only

```bash
# Build and run frontend only
docker-compose up --build frontend

# Run frontend in detached mode
docker-compose up --build -d frontend
```

### Backend Only

```bash
# Build and run backend only
docker-compose up --build backend

# Run backend in detached mode
docker-compose up --build -d backend
```

## Development Commands

### Install Dependencies

The Docker setup automatically installs dependencies:

- **Frontend**: `npm ci` runs during build
- **Backend**: `pip install -r requirements.txt` runs during build

### Hot Reload

Both services support hot reload for development:

- **Frontend**: Next.js development server with hot reload
- **Backend**: Uvicorn with `--reload` flag enabled

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Stop and remove images
docker-compose down --rmi all
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Check what's using the ports
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :8000

   # Kill the process or change ports in docker-compose.yml
   ```

2. **Permission Issues**

   ```bash
   # On Linux/Mac, you might need to use sudo
   sudo docker-compose up --build
   ```

3. **Build Failures**
   ```bash
   # Clean up and rebuild
   docker-compose down
   docker system prune -f
   docker-compose up --build
   ```

### View Container Status

```bash
# List running containers
docker-compose ps

# List all containers (including stopped)
docker-compose ps -a
```

### Access Container Shell

```bash
# Access frontend container
docker-compose exec frontend sh

# Access backend container
docker-compose exec backend bash
```

## Environment Variables

You can customize the setup by creating a `.env` file in the root directory:

```env
# Frontend
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend
PYTHONPATH=/app
ENVIRONMENT=development
```

## Production Deployment

For production deployment, modify the Dockerfiles:

1. **Frontend**: Change `npm ci --only=production` to `npm ci`
2. **Backend**: Remove `--reload` flag from uvicorn command
3. **Environment**: Set `NODE_ENV=production` and `ENVIRONMENT=production`

## Services Overview

### Frontend Service

- **Port**: 3000
- **Framework**: Next.js 15
- **Language**: TypeScript
- **Package Manager**: npm

### Backend Service

- **Port**: 8000
- **Framework**: FastAPI
- **Language**: Python 3.11
- **Server**: Uvicorn
- **Package Manager**: pip

## Network Configuration

The services communicate through a custom Docker network:

- **Network Name**: linkedin-scraper-network
- **Type**: Bridge network
- **Internal Communication**: Services can communicate using service names

## Volumes

The setup uses volumes for:

- **Development**: Source code mounted for hot reload
- **Dependencies**: Node modules and Python packages cached
- **Build Cache**: Next.js build cache preserved
