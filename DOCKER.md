# Docker Deployment Guide

## Quick Start

The easiest way to run the Invoice Generator is using Docker and the provided Makefile:

```bash
make run
```

This single command will:
1. Build both backend and frontend Docker images
2. Start the containers
3. Make the application available at http://localhost

## Makefile Commands

### Basic Commands

| Command | Description |
|---------|-------------|
| `make run` | Build and start the application |
| `make stop` | Stop all containers |
| `make restart` | Restart all containers |
| `make logs` | View logs from all containers |
| `make ps` | Show container status |
| `make clean` | Remove containers, networks, and images |

### Advanced Commands

| Command | Description |
|---------|-------------|
| `make build` | Build Docker images only |
| `make logs-backend` | View backend logs |
| `make logs-frontend` | View frontend logs |
| `make dev` | Run in local development mode |
| `make test` | Test the deployment |
| `make help` | Show all available commands |

## Architecture

The Docker setup consists of two services:

### Backend Service
- **Base Image**: `node:18-alpine`
- **Port**: 3001
- **Dependencies**: Includes poppler-utils for PDF to image conversion
- **Health Check**: Polls `/api/health` endpoint

### Frontend Service
- **Build Stage**: `node:18-alpine` (Vite build)
- **Production Stage**: `nginx:alpine`
- **Port**: 80 (maps to http://localhost)
- **Proxy**: Nginx proxies `/api/*` requests to backend

## Configuration

### docker-compose.yml

The application is configured to run with:
- **Backend**: Runs on port 3001
- **Frontend**: Runs on port 80 (accessible at http://localhost)
- **Auto-restart**: Containers restart automatically unless stopped manually
- **Health Checks**: Both services have health checks for monitoring

### Environment Variables

You can customize the backend by setting environment variables in `docker-compose.yml`:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3001
```

## Volumes

The application creates a volume for persistent invoice storage:
- `./invoices:/app/invoices` - Stores generated invoices

## Accessing the Application

After running `make run`, access:
- **Web Interface**: http://localhost
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

## Troubleshooting

### Check Container Status
```bash
make ps
```

### View Logs
```bash
# All logs
make logs

# Backend only
make logs-backend

# Frontend only
make logs-frontend
```

### Restart Containers
```bash
make restart
```

### Complete Cleanup
If you encounter issues, clean everything and start fresh:
```bash
make clean
make run
```

### Port Conflicts

If port 80 or 3001 is already in use, you can modify the ports in `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "3002:3001"  # Change 3001 to your preferred port
  
  frontend:
    ports:
      - "8080:80"    # Change 80 to your preferred port
```

Then access the app at http://localhost:8080

## Development vs Production

### Using Docker (Production-like)
```bash
make run
```
- Optimized builds
- Nginx serves static files
- Auto-restart on failure

### Local Development
```bash
make dev
# or
npm run dev
```
- Hot reload
- Development tools
- Faster iteration

## Manual Docker Commands

If you prefer not to use the Makefile:

```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

## Building for Production

To create optimized production builds:

```bash
make build
```

This will:
1. Install production dependencies only
2. Build optimized frontend bundle
3. Create minimal Docker images
