.PHONY: help build run run-local stop restart clean logs test dev install server client

# Default target
help:
	@echo "Invoice Generator - Makefile Commands"
	@echo "======================================"
	@echo ""
	@echo "Docker Commands:"
	@echo "  make run          - Build and start the application in Docker"
	@echo "  make build        - Build Docker images"
	@echo "  make stop         - Stop all containers"
	@echo "  make restart      - Restart all containers"
	@echo "  make clean        - Stop and remove containers, networks, and images"
	@echo "  make logs         - Show logs from all containers"
	@echo "  make logs-backend - Show backend logs"
	@echo "  make logs-frontend- Show frontend logs"
	@echo "  make ps           - Show running containers"
	@echo ""
	@echo "Local Development Commands:"
	@echo "  make run-local    - Run app locally (without Docker) ⭐"
	@echo "  make dev          - Alias for run-local"
	@echo "  make server       - Run backend server only"
	@echo "  make client       - Run frontend only"
	@echo "  make install      - Install all dependencies"
	@echo ""
	@echo "Testing:"
	@echo "  make test         - Run tests"
	@echo ""

# Build Docker images
build:
	@echo "Building Docker images..."
	docker-compose build

# Build and run the application
run:
	@echo "Starting Invoice Generator..."
	docker-compose up -d --build
	@echo ""
	@echo "✓ Application is starting!"
	@echo ""
	@echo "Frontend: http://localhost"
	@echo "Backend API: http://localhost:3001"
	@echo ""
	@echo "Run 'make logs' to view logs"
	@echo "Run 'make stop' to stop the application"

# Stop all containers
stop:
	@echo "Stopping containers..."
	docker-compose down

# Restart containers
restart:
	@echo "Restarting containers..."
	docker-compose restart

# Clean up everything
clean:
	@echo "Cleaning up..."
	docker-compose down -v --rmi all --remove-orphans
	@echo "✓ Cleanup complete"

# Show logs from all containers
logs:
	docker-compose logs -f

# Show backend logs
logs-backend:
	docker-compose logs -f backend

# Show frontend logs
logs-frontend:
	docker-compose logs -f frontend

# Run in development mode (local, without Docker)
run-local:
	@echo "Starting Invoice Generator (Local Development Mode)"
	@echo "===================================================="
	@echo ""
	@echo "Prerequisites:"
	@echo "  • Node.js installed"
	@echo "  • Dependencies installed (run 'make install' if needed)"
	@echo "  • Poppler installed (for PDF to image conversion)"
	@echo ""
	@echo "Starting both servers..."
	@echo ""
	@echo "Backend:  http://localhost:3001"
	@echo "Frontend: http://localhost:5173"
	@echo ""
	@echo "Press Ctrl+C to stop both servers"
	@echo ""
	npm run dev

# Alias for run-local
dev: run-local

# Run backend server only
server:
	@echo "Starting backend server..."
	@echo "Backend will run on http://localhost:3001"
	npm run server

# Run frontend only
client:
	@echo "Starting frontend..."
	@echo "Frontend will run on http://localhost:5173"
	npm run client

# Run tests
test:
	@echo "Running tests..."
	@echo "Testing backend API..."
	@curl -s http://localhost:3001/api/health && echo "✓ Backend is healthy" || echo "✗ Backend not responding"
	@echo ""
	@curl -s http://localhost && echo "✓ Frontend is accessible" || echo "✗ Frontend not accessible"

# Show container status
ps:
	docker-compose ps

# Install dependencies
install:
	@echo "Installing dependencies..."
	npm install
	cd client && npm install
	@echo "✓ Dependencies installed"
