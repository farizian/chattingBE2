# Deployment Guide

## Prerequisites

1. **Supabase Project Setup**
   - Create a new project at [supabase.com](https://supabase.com)
   - Get your project URL and API keys
   - Run the migration files in your Supabase SQL editor

2. **Environment Variables**
   - Copy `.env.production` to `.env`
   - Fill in your actual Supabase credentials
   - Generate a strong JWT secret for `pwtoken`

## Deployment Options

### Option 1: Railway (Recommended)

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

**Environment Variables to Set:**
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
pwtoken=your_jwt_secret
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Option 2: Heroku

1. Install Heroku CLI
2. Create new Heroku app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set VARIABLE_NAME=value`
4. Deploy: `git push heroku main`

### Option 3: Render

1. Connect GitHub repository
2. Choose "Web Service"
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in dashboard

### Option 4: DigitalOcean App Platform

1. Create new app from GitHub
2. Configure build and run commands
3. Set environment variables
4. Deploy

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify Socket.IO connections work
- [ ] Check authentication flow
- [ ] Test file upload functionality
- [ ] Verify database connections
- [ ] Test real-time messaging
- [ ] Check CORS configuration
- [ ] Monitor logs for errors

## Monitoring

- Check `/health` endpoint for server status
- Monitor logs for errors
- Set up uptime monitoring
- Configure alerts for critical issues

## Security Notes

- JWT secret should be at least 32 characters
- Enable HTTPS in production
- Configure CORS for your specific frontend domain
- Rate limiting is enabled for authentication endpoints
- All database operations use RLS policies

## Scaling Considerations

- Use PM2 for process management (ecosystem.config.js included)
- Consider Redis for session storage in multi-instance deployments
- Monitor memory usage and CPU
- Set up database connection pooling if needed