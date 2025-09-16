# BeeDab Real Estate Platform

## Overview
BeeDab is a comprehensive real estate platform tailored for the Botswana market. It facilitates property listings, rental management, auctions, and integrated services for buyers, sellers, agents, and FSBO users. The platform supports English and Setswana languages and complies with local Real Estate Advisory Council (REAC) regulations, aiming to be a leading real estate solution in Botswana.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
-   **Frontend Framework**: React 18 with TypeScript.
-   **Styling**: Tailwind CSS for responsive design, utilizing BeeDab brand colors.
-   **State Management**: TanStack Query for server state, React Context for global state.
-   **Routing**: React Router.
-   **Animations**: Framer Motion for UI transitions.
-   **Component Library**: Radix UI with shadcn/ui components for design consistency.

### Technical Implementations
-   **Backend Runtime**: Node.js with Express.js for REST APIs.
-   **Language**: TypeScript with strict type checking.
-   **Build System**: esbuild for fast backend compilation, Vite for frontend.
-   **API Design**: RESTful endpoints with Zod for validation.
-   **Error Handling**: Centralized middleware.
-   **Database**: PostgreSQL via Neon serverless, managed with Drizzle ORM for type-safe queries and migrations.

### Feature Specifications
-   **User Management**: Multi-role authentication (buyer/seller/agent/FSBO) including REAC certification tracking and role-based authorization.
-   **Property Management**: CRUD operations, advanced search/filtering, and a plot marketplace with location-based search.
-   **Communication**: Bilingual chat widget, in-app messaging, and WhatsApp integration.
-   **Document Management**: Secure file upload.
-   **Services Directory**: Integrated service provider network with contextual advertising and hierarchical category organization.
-   **Auction Platform**: Property auction listings with bidding.
-   **AI Features**: Natural language search and property valuation.
-   **Financial Tools**: Mortgage calculator with local banking data.
-   **Compliance**: Legal requirement tracking for Botswana property law.
-   **Geography Selector**: Botswana-specific location hierarchy using official census data.
-   **Reviews**: Comprehensive user review system with moderation.
-   **Trust & Safety**: Verification badges for users and listings.
-   **Notifications**: Integrated toast notification and notification center system.

### System Design Choices
-   **Deployment**: Vite dev server for development, static frontend served by Express in production, serverless PostgreSQL.
-   **Scalability**: Database connection pooling, query optimization, static asset caching, CDN integration, API rate limiting.

## External Dependencies

-   **@neondatabase/serverless**: PostgreSQL database connection.
-   **drizzle-orm**: Type-safe database ORM.
-   **@tanstack/react-query**: Server state management.
-   **framer-motion**: Animation library.
-   **@radix-ui/***: UI component primitives.
-   **zod**: Runtime type validation.
-   **react-hook-form**: Form management.
-   **Vite**: Frontend build tool.
-   **TypeScript**: Language and type checking.
-   **Tailwind CSS**: Styling framework.
-   **esbuild**: Backend compilation.
-   **OpenAI API**: (Optional) AI-powered search.
-   **WebSocket**: (Planned) Real-time chat.