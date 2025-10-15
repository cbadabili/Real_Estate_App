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
- Fixed Vite allowedHosts: Added `allowedHosts: ['all']` to accept Replit domain requests
- Fixed rental table schema mismatch: Updated migration to create `rental_listings` table matching Drizzle schema
- Fixed backend port configuration: Changed default from 5000 to 5001 to avoid conflict with Vite
- Fixed missing properties seeding: Added `seedProperties()` call to seed manager
- All seeding now works correctly: 12 properties + 5 rentals + all other data

## User Preferences
- Package manager: npm
- Database: PostgreSQL only (no file-based databases)
- Development environment: Replit with auto-restart workflows
