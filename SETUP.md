# BeeDaB Setup Guide

## Quick Setup

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd beedab-real-estate
npm install
```

### 2. Database Setup
```bash
# Push database schema
npm run db:push

# Seed sample data
npx tsx server/seed.ts
npx tsx server/services-seed.ts
```

### 3. Start Development
```bash
npm run dev
```

## Repository Structure

```
beedab-real-estate/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── ChatWidget.tsx           # Bilingual chat
│   │   │   ├── DocumentUploader.tsx     # File management
│   │   │   ├── ValuationCard.tsx        # AI property valuation
│   │   │   ├── ComplianceGuide.tsx      # Legal compliance
│   │   │   └── services/                # Services directory
│   │   ├── pages/            # Page components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── contexts/         # React contexts
│   │   └── i18n/             # Translations (EN/Setswana)
├── server/                   # Express backend
│   ├── routes.ts             # API endpoints
│   ├── storage.ts            # Database operations
│   ├── services-storage.ts   # Services directory
│   ├── ai-search.ts          # AI search functionality
│   └── seed.ts               # Database seeding
├── shared/                   # Shared TypeScript types
│   ├── schema.ts             # Main database schema
│   ├── services-schema.ts    # Services schema
│   └── auction-schema.ts     # Auction schema
└── package.json
```

## Key Features

### 1. Advanced Property Management
- Multi-criteria search and filtering
- Interactive property listings
- Virtual tour support
- Property analytics and insights

### 2. Auction Platform
- Complete auction system
- Bidding interface
- Scheduling and notifications
- Bank-independent design

### 3. Services Directory
- Contextual advertising engine
- Service provider listings
- Review and rating system
- Category-based filtering

### 4. Communication Tools
- Real-time bilingual chat
- Property inquiries
- Appointment scheduling
- Notification system

### 5. Financial Tools
- Mortgage calculator
- AI property valuation
- Market trend analysis
- Affordability assessment

### 6. Legal & Compliance
- Botswana property law compliance
- Document management system
- Digital signature support
- Process tracking

## Environment Variables

Required environment variables (automatically provided by Replit):
- `DATABASE_URL` - PostgreSQL connection string
- `PGHOST` - Database host
- `PGPORT` - Database port
- `PGUSER` - Database user
- `PGPASSWORD` - Database password
- `PGDATABASE` - Database name

## API Endpoints

### Properties
- `GET /api/properties` - List properties with filtering
- `POST /api/properties` - Create new property
- `GET /api/properties/:id` - Get property details
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Services
- `GET /api/services/categories` - List service categories
- `GET /api/services/providers` - List service providers
- `GET /api/ads/contextual/:trigger` - Get contextual ads

### Advanced Features
- `POST /api/valuation` - Property valuation
- `GET /api/trends/:area` - Market trends
- `POST /api/documents/upload` - Document upload
- `GET /api/compliance/:type/:transaction` - Compliance requirements
- `GET /api/chat/rooms/:propertyId` - Chat rooms

## Development Notes

### Database Schema
The platform uses Drizzle ORM with PostgreSQL. Schema files:
- `shared/schema.ts` - Main schema (users, properties, etc.)
- `shared/services-schema.ts` - Services and advertising
- `shared/auction-schema.ts` - Auction functionality

### Bilingual Support
Translation files in `client/src/i18n/translations.json` support:
- English (en)
- Setswana (tn)

### Responsive Design
All components are built with mobile-first responsive design using Tailwind CSS.

## Production Deployment

The application is ready for production deployment with:
- Optimized builds
- Error handling
- Security measures
- Performance optimizations
- SEO-friendly structure

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license information here]