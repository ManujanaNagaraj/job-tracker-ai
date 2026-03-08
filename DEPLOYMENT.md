# Deployment Guide - Job Tracker AI

This guide covers deployment options for Job Tracker AI including Railway, Vercel, and Docker.

## Table of Contents
- [Railway + Vercel Deployment](#railway--vercel-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Database Migrations](#database-migrations)

---

## Railway + Vercel Deployment

### Backend Deployment (Railway)

1. **Create Railway Account**
   - Sign up at [railway.app](https://railway.app)
   - Connect your GitHub account

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `job-tracker-ai` repository
   - Railway auto-detects Python and uses `backend/Procfile`

3. **Add PostgreSQL Database**
   - In your project, click "+ New"
   - Select "Database" → "PostgreSQL"
   - Railway automatically sets `DATABASE_URL` environment variable

4. **Configure Environment Variables**
   ```bash
   OPENAI_API_KEY=sk-...
   REMINDER_EMAIL=your_email@gmail.com
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_gmail_app_password
   FRONTEND_URL=https://your-app.vercel.app
   ```

5. **Set Root Directory** (if needed)
   - Settings → Build → Root Directory: `backend`

6. **Deploy**
   - Railway automatically deploys on git push
   - Get your backend URL: `https://your-app.railway.app`

### Frontend Deployment (Vercel)

1. **Create Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: **Vite**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variable**
   ```bash
   VITE_API_URL=https://your-backend-app.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Get your URL: `https://your-app.vercel.app`

5. **Update Railway CORS**
   - Go back to Railway
   - Update `FRONTEND_URL` to your Vercel URL
   - This allows CORS requests from frontend

---

## Docker Deployment

### Prerequisites
- Docker and Docker Compose installed
- `.env` file configured (see [Environment Variables](#environment-variables))

### Quick Start

1. **Clone Repository**
   ```bash
   git clone https://github.com/ManujanaNagaraj/job-tracker-ai.git
   cd job-tracker-ai
   ```

2. **Configure Environment**
   ```bash
   # Create .env file in project root
   cp backend/.env.example .env
   # Edit .env with your values
   ```

3. **Build and Run**
   ```bash
   docker-compose up -d
   ```

4. **Access Application**
   - Frontend: http://localhost
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

5. **View Logs**
   ```bash
   docker-compose logs -f
   ```

6. **Stop Services**
   ```bash
   docker-compose down
   ```

### Production Docker Build

For production without docker-compose:

```bash
# Build Backend
cd backend
docker build -t job-tracker-backend .

# Build Frontend
cd ../frontend
docker build --build-arg VITE_API_URL=https://your-api.com -t job-tracker-frontend .

# Run with your own PostgreSQL
docker run -d \
  -p 8000:8000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e OPENAI_API_KEY=sk-... \
  job-tracker-backend

docker run -d -p 80:80 job-tracker-frontend
```

---

## Environment Variables

### Backend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Yes (prod) | `postgresql://user:pass@host:5432/db` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes | `sk-proj-...` |
| `REMINDER_EMAIL` | Email address for sending reminders | No | `noreply@example.com` |
| `SMTP_HOST` | SMTP server hostname | No | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | No | `465` |
| `SMTP_USER` | SMTP username | No | `your_email@gmail.com` |
| `SMTP_PASSWORD` | SMTP password or app password | No | `your_app_password` |
| `FRONTEND_URL` | Frontend URL for CORS | No | `https://app.vercel.app` |

**Note:** For local development, `DATABASE_URL` defaults to SQLite: `sqlite:///./job_tracker.db`

### Frontend Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | `https://api.railway.app` |

**Local Development:** Uses `http://localhost:8000` by default

---

## Database Migrations

### Railway/Production

Migrations run automatically via `Procfile`:
```
web: alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Manual Migration

```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one version
alembic downgrade -1

# View migration history
alembic history
```

### Docker Migration

Migrations run automatically on container start via `CMD` in Dockerfile.

To run manually:
```bash
docker-compose exec backend alembic upgrade head
```

---

## Troubleshooting

### Railway Issues

**Problem:** Backend won't start
- Check Railway logs for errors
- Verify all environment variables are set
- Ensure PostgreSQL database is provisioned

**Problem:** CORS errors
- Set `FRONTEND_URL` in Railway to match Vercel URL
- Check CORS middleware in `backend/main.py`

### Vercel Issues

**Problem:** API calls fail
- Verify `VITE_API_URL` points to Railway backend
- Check Network tab in browser DevTools
- Ensure Railway backend is running

**Problem:** 404 on refresh
- `vercel.json` should have SPA routing configured
- Check that `vercel.json` is in `frontend/` directory

### Docker Issues

**Problem:** Database connection failed
- Ensure PostgreSQL container is running: `docker-compose ps`
- Check `DATABASE_URL` format
- View logs: `docker-compose logs db`

**Problem:** Port already in use
- Change ports in `docker-compose.yml`
- Or stop conflicting services

---

## Health Checks

- **Backend:** `GET /health` → Returns `{"status": "healthy"}`
- **Frontend (nginx):** `GET /health` → Returns `"healthy"`

---

## Post-Deployment

1. **Test AI Features**
   - Add a job application
   - Generate AI tips
   - Verify OpenAI integration works

2. **Test Email Reminders** (if configured)
   - Create a reminder
   - Send test email
   - Check SMTP logs

3. **Monitor Logs**
   - Railway: Check deployment logs
   - Vercel: Check function logs
   - Docker: `docker-compose logs -f`

4. **Set up Custom Domain** (optional)
   - Railway: Settings → Domains
   - Vercel: Settings → Domains

---

## Support

For issues or questions:
- GitHub Issues: https://github.com/ManujanaNagaraj/job-tracker-ai/issues
- Documentation: See README.md

---

**Version:** 1.0.0  
**Last Updated:** 2026-03-08
