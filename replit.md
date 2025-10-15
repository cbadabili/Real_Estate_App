# BeeDab Real Estate Platform - Replit Configuration

## Project Overview
A comprehensive real estate platform built with React, TypeScript, Node.js, Express, and PostgreSQL. Successfully migrated from Vercel to Replit on October 15, 2025.

## Architecture

### Technology Stack
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript  
- **Database**: PostgreSQL (Replit-hosted)
- **Package Manager**: npm

### Port Configuration
- **Frontend (Vite Dev Server)**: Port 5000
- **Backend (Express API)**: Port 5001
- **Vite Proxy**: `/api/*` → `http://localhost:5001`

## Development Setup

### Environment Variables
The following environment variables are configured via Replit Secrets:
- `DATABASE_URL` - PostgreSQL connection string (auto-configured by Replit)
- `SESSION_SECRET` - Session encryption key
- `JWT_SECRET` - JWT token signing key
- `OPENAI_API_KEY` - OpenAI API key for AI-powered search features
- `MAPBOX_TOKEN` - Mapbox access token for interactive maps
- `CORS_ORIGIN` - Allowed CORS origins (set in .env file)

### Running the Application
The project uses a single workflow that runs both servers:
```bash
bash -c "npx tsx server/index.ts & vite --config client/vite.config.ts"
```

### Database Migrations
Migrations run automatically on server start. Located in `server/migrations/`.

Note: There's a known non-fatal warning about `rental_listings` table during seeding. The table exists as `rentals` in the migration but the seed script references `rental_listings`. This doesn't affect core functionality.

## Migration Notes (Oct 15, 2025)

### Changes Made for Replit Compatibility
1. **Port Configuration**: 
   - Frontend moved to port 5000 (required by Replit for web preview)
   - Backend runs on port 5001
   - Vite proxy configured to forward API requests

2. **CORS Configuration**:
   - Updated default CORS origin from localhost:5173 to localhost:5000
   - Production CORS uses REPLIT_DOMAINS environment variable

3. **Code Fixes**:
   - Removed duplicate code blocks in `server/routes/property-routes.ts`
   - Fixed Zod schema validation in `shared/schema.ts` (changed from `z.coerce.number()` to `z.number()` with proper method chaining)

4. **Deployment Configuration**:
   - Set up for Replit Autoscale deployment
   - Build command: `npm run build`
   - Start command: Backend and preview server

### Recent Fixes (Oct 15, 2025)
- **Vite Configuration**: Configured HMR with proper Replit WebSocket settings (wss:// protocol)
- **Database Schema**: Fixed rental_listings table structure to match Drizzle schema
- **Port Configuration**: Backend now uses port 5001, Vite uses port 5000 (no conflicts)
- **Data Seeding**: Added seedProperties() call - now seeding 12 properties + 5 rentals + all other data
- **Security**: CSP disabled in development for easier debugging, enabled in production

### Known Development Warnings (Non-Critical)
- WebSocket HMR connection may show CSP warnings in browser console (doesn't affect functionality)
- Replit dev banner CSP warning (cosmetic only)
- These are development-only warnings and don't occur in production

## User Preferences
- Package manager: npm
- Database: PostgreSQL only (no file-based databases)
- Development environment: Replit with auto-restart workflows
