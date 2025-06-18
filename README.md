# BeeDab Real Estate Platform

A comprehensive real estate platform built with React, TypeScript, Node.js, and PostgreSQL. This platform supports both For Sale By Owner (FSBO) listings and agent-managed properties, with advanced search capabilities and integrated APIs.

## Features

### 🏠 Property Management
- **Advanced Property Search**: Filter by price, location, property type, bedrooms, bathrooms, and more
- **FSBO Support**: Complete For Sale By Owner tools and workflows
- **Agent Integration**: Support for REAC-certified agents and MLS listings
- **Interactive Property Listings**: High-resolution photos, detailed descriptions, and property features
- **Property Analytics**: View counts, market insights, and pricing trends

### 💰 Financial Tools
- **Mortgage Calculator**: Built-in calculator with real-time payment estimates
- **Affordability Analysis**: Financial planning tools for buyers
- **Market Valuations**: AI-powered property value estimates

### 🗺️ Location Services
- **Interactive Maps**: Property location visualization and neighborhood insights
- **Neighborhood Data**: Demographics, schools, amenities, and safety information
- **Geolocation Search**: Find properties within specific areas

### 👥 User Management
- **Multi-User Types**: Support for buyers, sellers, agents, and FSBO users
- **Authentication System**: Secure login and registration
- **User Profiles**: Personalized dashboards and preferences
- **Appointment Scheduling**: Book property viewings and consultations

### 📱 Communication
- **Property Inquiries**: Direct messaging between buyers and sellers/agents
- **Real-time Notifications**: Updates on saved properties and market changes
- **Review System**: Property and agent ratings and reviews

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Hook Form** with Zod validation
- **TanStack Query** for data fetching
- **React Router** for navigation

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** with Drizzle ORM
- **Zod** for API validation
- **RESTful API** architecture

### Database Schema
- Users (buyers, sellers, agents, FSBO)
- Properties with comprehensive details
- Inquiries and appointments
- Saved properties and reviews
- Neighborhood and market data

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd beedab-real-estate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   npm run db:push
   ```

4. **Seed sample data**
   ```bash
   npx tsx server/seed.ts
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## API Endpoints

### Properties
- `GET /api/properties` - List properties with filtering
- `GET /api/properties/:id` - Get property details
- `POST /api/properties` - Create new property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Users
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Inquiries & Appointments
- `POST /api/inquiries` - Send property inquiry
- `GET /api/properties/:id/inquiries` - Get property inquiries
- `POST /api/appointments` - Schedule property viewing
- `GET /api/users/:id/appointments` - Get user appointments

### Financial Tools
- `POST /api/mortgage/calculate` - Calculate mortgage payments
- `GET /api/neighborhoods/:zipCode` - Get neighborhood data

### Saved Properties
- `GET /api/users/:id/saved-properties` - Get saved properties
- `POST /api/users/:userId/saved-properties/:propertyId` - Save property
- `DELETE /api/users/:userId/saved-properties/:propertyId` - Unsave property

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # React contexts
│   │   └── lib/           # Utility functions
├── server/                # Backend Node.js application
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   ├── db.ts              # Database connection
│   └── seed.ts            # Database seeding
├── shared/                # Shared TypeScript types
│   └── schema.ts          # Database schema and types
└── package.json
```

## Key Features Implementation

### 1. Advanced Search & Filtering
The platform supports comprehensive property search with multiple filter criteria:
- Price range filtering
- Property type selection (house, condo, townhouse, etc.)
- Bedroom and bathroom counts
- Square footage ranges
- Location-based search (city, state, ZIP code)
- Listing type filtering (FSBO, Agent, MLS)

### 2. Mortgage Calculator
Built-in financial tools help users make informed decisions:
- Real-time payment calculations
- Interest rate comparisons
- Down payment scenarios
- Total interest and payment breakdowns

### 3. Property Management
Comprehensive property listing capabilities:
- Multi-step property creation wizard
- Image upload and management
- Feature tagging and descriptions
- Status tracking (active, pending, sold)
- View analytics and engagement metrics

### 4. User Experience
Modern, responsive design with:
- Smooth animations and transitions
- Mobile-first responsive layout
- Intuitive navigation and search
- Real-time data updates
- Error handling and loading states

## Deployment

The application is configured for deployment on Replit with:
- Production build optimization
- Environment variable management
- Database migrations
- Static asset serving
- Health check endpoints

To deploy:
1. Configure environment variables
2. Run `npm run build` for production build
3. Start with `npm start`

## API Integration Ready

The platform is designed to integrate with external real estate APIs:
- **MLS Integration**: Ready for Multiple Listing Service data
- **Zillow/Realtor API**: Property data aggregation
- **Google Maps API**: Enhanced location services
- **Mortgage Lender APIs**: Real-time rate information
- **Document Management**: E-signature and document storage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions and support, please contact the development team or create an issue in the repository.