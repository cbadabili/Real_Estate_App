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

- **June 29, 2025**: Complete role-based authorization system implementation throughout entire BeeDab application
  - Implemented comprehensive role-based access control across all navigation elements (desktop and mobile)
  - Created RoleBasedComponent wrapper for granular UI permission controls throughout the application
  - Enhanced Navbar with role-specific dropdown menus ensuring users only see appropriate options
  - Added role-based access to Sell dropdown (sellers, agents, fsbo, admin, super_admin only)
  - Implemented role-specific navigation controls for Service Provider registration and listings
  - Built comprehensive mobile navigation with role-based access controls for all sections
  - Added admin-only access controls for Admin Panel in both desktop and mobile navigation
  - Enhanced ProtectedRoute component with multi-role authentication and permission checking
  - Created comprehensive LoginPage with multi-role authentication supporting all user types
  - Implemented role-based access control for property creation and management features
  - Added role-specific rental property management controls throughout the interface
  - Built complete authorization middleware with granular permission system and audit logging
  - Enhanced authentication system with JWT-style token verification and role validation
  - Integrated role-based access controls ensuring users only see content appropriate to their permissions

- **June 29, 2025**: Complete review and ratings system with multi-role authentication implementation
  - Implemented comprehensive user review system with role-based permissions and authorization
  - Created multi-role authentication supporting buyer, seller, agent, fsbo, admin, moderator, and super_admin roles
  - Built complete review management with helpful voting, responses, and moderation capabilities
  - Added advanced permission system with granular access controls for all user operations
  - Implemented admin audit logging with comprehensive tracking of all system actions
  - Created ReviewCard, ReviewForm, and UserReviews components with real-time interactions
  - Built authentication middleware with JWT-style token verification and role checking
  - Added comprehensive review storage layer with filtering, sorting, and statistics
  - Implemented review flagging and moderation system for content quality control
  - Created admin dashboard with user management and system oversight capabilities
  - Added review statistics with rating distributions and verified review tracking
  - Built response system for businesses to reply to customer reviews
  - Enhanced database schema with complete review relations and audit trail
  - Integrated PostgreSQL database with proper migrations and schema management

- **June 29, 2025**: Complete property search and discovery system implementation
  - Built comprehensive AI-powered search system with natural language processing
  - Created SmartSearchBar component with intelligent query interpretation and Botswana location suggestions
  - Implemented PropertyGrid with multiple view modes (grid, list, map) and smooth animations
  - Added PropertyMap component for interactive property visualization across Botswana cities
  - Built PropertyComparison modal for side-by-side analysis of up to 4 properties
  - Created SavedSearches component with local storage and search management
  - Enhanced PropertyFilters with Botswana-specific locations and price ranges
  - Added QuickActions sidebar with property management shortcuts and market statistics
  - Implemented SearchResultsHeader with sorting, filtering, and view mode controls
  - Created comprehensive error handling system with retry functionality
  - Added user preferences storage for persistent search settings and view modes
  - Built responsive PageHeader component for consistent navigation
  - Enhanced property cards with comparison functionality and detailed information display
  - Implemented real-time search suggestions and AI confidence scoring

- **June 24, 2025**: Complete error handling and notification system implementation
  - Created comprehensive loading spinner component with different types (search, properties, calculation)
  - Implemented ErrorBoundary component with retry functionality and development error details
  - Added Toast notification system with success, error, warning, and info types
  - Built NotificationCenter with real-time updates and API integration (no mock data)
  - Created useAsyncOperation hook for better async state management
  - Enhanced Properties page with proper error states and loading skeletons
  - Added OfflineIndicator for network status monitoring
  - Implemented useLocalStorage hook for user preferences and recent searches
  - Updated App.tsx with QueryClient, error boundaries, and notification providers
  - Added notification API endpoints with proper error handling
  - Enhanced Navbar with integrated notification center
  - Improved form submission handling with retry capability and better error messaging

- **June 24, 2025**: Services navigation streamlining and hierarchical category organization
  - Removed redundant specializations from Services dropdown navigation (Plumbing, Electrical, HVAC, etc.)
  - Streamlined Services dropdown to show only main categories: Legal, Finance, Construction
  - Filtered out duplicate categories from Services page grid display
  - Updated Service Provider Registration form with hierarchical category selection
  - Added Construction subcategories: HVAC, Plumbing, Electrical, Roofing, Flooring, Painting
  - Added Maintenance subcategories: Garden, Pool, Security
  - Implemented dynamic subcategory dropdown that appears based on main category selection
  - Maintained consistency between navigation dropdown, Services page display, and registration form

- **June 25, 2025**: Services navigation enhancement and consistency improvements
  - Added Services dropdown menu to main navigation matching Buy/Sell/Rent structure
  - Fixed duplicate Map Search appearing twice in navbar by consolidating navigation arrays
  - Updated Services dropdown links to use consistent category filtering (?category=legal, ?category=financing, etc.)
  - Improved mobile navigation organization with proper Services section
  - Enhanced Services page to handle URL parameters for category filtering
  - Maintained consistent styling and hover behavior across all navigation dropdowns

- **June 25, 2025**: Comprehensive platform enhancement with trust & safety focus
  - Implemented complete trust engineering system with verification badges for agents, landlords, and listings
  - Added comprehensive plot marketplace with location-based search for Botswana's prime areas
  - Created advanced mortgage calculator with local bank rates and affordability assessment tools
  - Built secure communication system with in-app messaging and reporting functionality
  - Integrated comprehensive testing dashboard for end-to-end validation and persona testing
  - Enhanced navigation with dedicated plots section and improved property verification display
  - Added bilingual support (English/Setswana) for inclusive user experience
  - Implemented WhatsApp integration for seamless seller-buyer communication
  - Created interactive map showing popular locations with real market data
  - Enhanced property features with comprehensive amenities checklist and area build tracking

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