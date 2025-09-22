
# ADR-0001: Use Drizzle ORM for Database Access

## Status
Accepted

## Context
We needed to choose an ORM/database access layer for the BeeDab real estate platform. The application requires:
- Type-safe database operations
- Support for complex queries (property search, geospatial)
- PostgreSQL compatibility
- Good performance for read-heavy workloads
- Developer experience and productivity

## Decision
We will use Drizzle ORM as our primary database access layer.

## Options Considered

### Drizzle ORM
**Pros:**
- Full TypeScript support with compile-time type checking
- Lightweight with minimal runtime overhead
- SQL-first approach - easy to optimize queries
- Excellent PostgreSQL support including PostGIS
- Built-in migration system
- No decorators or reflection magic

**Cons:**
- Newer ecosystem compared to alternatives
- Smaller community
- Limited ORM features (no eager loading, etc.)

### Prisma
**Pros:**
- Mature ecosystem and large community
- Excellent developer tooling (Prisma Studio)
- Auto-generated client with type safety
- Built-in connection pooling

**Cons:**
- Query engine adds overhead
- Complex queries can be difficult
- Generated client can be large
- Migration system less flexible

### TypeORM
**Pros:**
- Full-featured ORM with decorators
- Active Record and Data Mapper patterns
- Extensive relationship support

**Cons:**
- Heavy runtime overhead
- Decorator-based approach can be complex
- TypeScript support issues in complex scenarios

## Consequences

### Positive
- Better performance due to lightweight design
- Full control over SQL queries for optimization
- Strong type safety prevents runtime database errors
- Easier to debug and profile database operations
- Simpler mental model - closer to raw SQL

### Negative
- Need to write more boilerplate for complex operations
- Manual relationship handling
- Smaller ecosystem means fewer third-party tools
- Team needs to learn Drizzle-specific patterns

## Implementation Notes
- Use Drizzle Kit for migrations
- Leverage PostgreSQL-specific features where beneficial
- Create repository pattern for complex business logic
- Use transactions for data consistency
- Monitor query performance and optimize as needed

## Review Date
This decision should be reviewed in 6 months (approximately July 2025) to assess:
- Developer productivity impact
- Performance characteristics in production
- Ecosystem maturity
- Any significant pain points encountered
