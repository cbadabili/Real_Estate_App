
# Contributing to BeeDab Real Estate Platform

## Development Workflow

### Branching Strategy
- Create feature branches from `main`
- Use descriptive branch names: `feature/property-search`, `fix/map-rendering`, `chore/update-deps`
- Submit pull requests for all changes
- Require at least one review before merging

### Commit Style
We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting, missing semicolons, etc.
- `refactor:` code changes that neither fix bugs nor add features
- `test:` adding or updating tests
- `chore:` maintenance tasks

Examples:
```
feat(search): add price range filtering
fix(maps): resolve coordinate validation issue
docs(api): update OpenAPI spec for properties endpoint
```

### CI Requirements
All pull requests must pass:
- ✅ TypeScript compilation (`npm run typecheck`)
- ✅ Linting (`npm run lint`)
- ✅ Tests (`npm run test`)
- ✅ Build process (`npm run build`)
- ✅ Database migration drift check (`npm run db:check`)

### Local Development Setup

1. **Start local database:**
   ```bash
   docker compose up -d
   export DATABASE_URL=postgresql://beedab:beedab@localhost:5432/beedab_dev?sslmode=disable
   ```

2. **Install dependencies:**
   ```bash
   npm ci
   ```

3. **Setup database:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **View API documentation:**
   Navigate to `http://localhost:5000/api/docs`

### Code Standards

- Use TypeScript for all new code
- Follow existing code style and patterns
- Add JSDoc comments for public APIs
- Write tests for new features
- Update documentation for breaking changes

### Pull Request Process

1. Update README.md if needed
2. Ensure CI passes
3. Request review from appropriate code owners
4. Address review feedback
5. Squash commits before merging

### Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Provide minimal reproduction steps
- Include environment details (OS, Node version, etc.)
- Search existing issues before creating new ones
