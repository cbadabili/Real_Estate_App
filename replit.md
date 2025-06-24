# BeeDab Real Estate Platform - Architecture Guide

## Overview

BeeDab is a comprehensive real estate platform for the Botswana market, featuring property listings, rental management, auction support, and integrated services. The platform serves buyers, sellers, agents, and FSBO (For Sale By Owner) users with multilingual support (English/Setswana) and compliance with local Real Estate Advisory Council (REAC) regulations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety
- **Styling**: Tailwind CSS with BeeDab brand colors and responsive design
- **State Management**: TanStack Query for server state, React Context for global state
- **Routing**: React Router for navigation
- **Animations**: Framer Motion for smooth UI transitions
- **Component Library**: Radix UI with shadcn/ui components for consistent design

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript with strict type checking
- **Build System**: esbuild for fast compilation and bundling
- **API Design**: RESTful endpoints with Zod validation schemas
- **Error Handling**: Centralized error middleware with proper HTTP status codes

### Database Layer
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Management**: Drizzle migrations with type-safe queries
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Data Modeling**: Relational design with proper foreign key constraints

## Key Components

### Core Modules
1. **User Management**: Multi-role authentication (buyer/seller/agent/fsbo) with REAC certification tracking
2. **Property Management**: CRUD operations with advanced search and filtering capabilities
3. **Communication System**: Bilingual chat widget with real-time messaging
4. **Document Management**: Secure file upload and categorization system
5. **Services Directory**: Integrated service provider network with contextual advertising
6. **Auction Platform**: Property auction listings with bidding functionality
7. **AI Features**: Natural language search and property valuation system

### Specialized Features
- **Compliance Guide**: Legal requirement tracking for Botswana property law
- **Mortgage Calculator**: Financial planning tools with local banking data
- **Geography Selector**: Botswana-specific location hierarchy (districts/cities/wards)
- **Contextual Advertising**: Service provider ads triggered by user actions

## Data Flow

### Property Listing Flow
1. User creates property through multi-step form with validation
2. Geographic data auto-populated from Botswana district/city hierarchy
3. Images uploaded and stored with metadata
4. Property saved to database with status tracking
5. Contextual ads triggered for relevant services (photography, legal, etc.)

### Search and Discovery Flow
1. AI-powered natural language search parsing
2. Query translated to structured filters
3. Database queries with proper indexing and pagination
4. Results cached with TanStack Query for performance
5. Real-time property view tracking and analytics

### Transaction Flow
1. User inquiry creation with property and user linking
2. Communication through bilingual chat system
3. Document upload and verification tracking
4. Compliance checklist progression
5. Appointment scheduling and management

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library
- **@radix-ui/***: UI component primitives
- **zod**: Runtime type validation
- **react-hook-form**: Form management with validation

### Development Tools
- **Vite**: Frontend build tool and dev server
- **TypeScript**: Type checking and compilation
- **Tailwind CSS**: Utility-first CSS framework
- **esbuild**: Backend compilation and bundling

### Optional Integrations
- **OpenAI API**: AI-powered search functionality (fallback without API key)
- **WebSocket**: Real-time chat features (planned implementation)

## Deployment Strategy

### Environment Configuration
- **Development**: Local Vite dev server with hot reload
- **Production**: Static frontend served by Express with API endpoints
- **Database**: Serverless PostgreSQL with environment variable configuration
- **Port Configuration**: Application runs on port 5000 for Replit compatibility

### Build Process
1. Frontend: Vite builds React app to optimized static assets
2. Backend: esbuild compiles TypeScript server to JavaScript
3. Database: Drizzle migrations applied automatically
4. Assets: Static files served from Express in production

### Scaling Considerations
- Database connection pooling for concurrent users
- Query optimization with proper indexing
- Static asset caching and CDN integration
- API rate limiting and authentication middleware

## Recent Changes

- **June 25, 2025**: Enhanced BeeDaB with Botswana-specific plot marketplace features
  - Added PlotSearchFilters component with location-based filtering for popular areas (Mogoditshane, Manyana, Mahalapye, Pitsane)
  - Created PlotListingCard component matching Facebook marketplace format with WhatsApp integration
  - Implemented SellerListingForm for direct seller listings with Botswana-specific validation
  - Added PlotAlerts component for location-based notifications with email/SMS support
  - Created bilingual support with English/Setswana translations for common real estate terms
  - Built InteractiveMap component showing popular plot locations with pricing data
  - Enhanced property features with amenities checklist and area build field
  - Fixed photo upload to only show ads after actual file selection
  - Resolved infinite loop warnings in form navigation and geography selector

- **June 23, 2025**: Fixed critical database connection issues
  - Resolved WebSocket connection problems with Neon database
  - Added proper Neon configuration with stability settings
  - Implemented database connection testing on startup
  - Improved error handling to prevent server crashes
  - Application now running successfully on port 5000

## Changelog

```
Changelog:
- June 23, 2025. Initial setup and database connection fixes
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```