# Quick Start Guide

## 🚀 Run with Docker (Recommended)

```bash
make run
```

Then open: **http://localhost**

## 📋 Common Commands

```bash
make run      # Start the application
make stop     # Stop the application
make logs     # View logs
make restart  # Restart
make clean    # Clean up everything
```

## 🔧 Local Development (Without Docker)

```bash
make run-local
# or
make dev
```

Then open: **http://localhost:5173**

**Run servers separately:**
```bash
make server   # Backend only (port 3001)
make client   # Frontend only (port 5173)
```

**Install dependencies:**
```bash
make install  # Installs both backend and frontend dependencies
```

## 📚 Documentation

- [README.md](README.md) - Full documentation
- [DOCKER.md](DOCKER.md) - Docker deployment guide
- [USAGE_GUIDE.md](USAGE_GUIDE.md) - How to use the app
- [FEATURES.md](FEATURES.md) - Feature list

## 🆘 Troubleshooting

**Port already in use?**
```bash
make stop
# or change ports in docker-compose.yml
```

**Need to rebuild?**
```bash
make clean
make run
```

**Check what's running:**
```bash
make ps
make logs
```
