# BeeDab Production Readiness & Benchmarking Test Strategy

This document defines the end-to-end quality strategy required to prove BeeDab is production ready for the Botswana market while meeting or exceeding UX, security, and performance benchmarks from leading global real-estate platforms (e.g., Zillow, Redfin). It aligns with the platform architecture documented in `docs/architecture.md` and will be implemented incrementally via CI/CD automation and seeded environments.

---

## Part A — Functional Test Strategy

### 1. Critical User Journeys (Playwright E2E)

Run Playwright specs on every pull request and nightly against a seeded PostgreSQL database. Execute on Chromium, Firefox, and WebKit at the following breakpoints: mobile (390px), tablet (768px), and desktop (1440px). Enforce ≤ 200ms interaction-to-next-paint (INP) and ≤ 2.5s largest-contentful-paint on 4G throttling for the search results grid and property detail pages via Playwright performance traces and Lighthouse budgets.

#### Anonymous discovery
- Load marketing/home page.
- Execute district/city search with Botswana seed data.
- Apply filters (price range, bedrooms, property type) and verify inclusive range semantics.
- Switch across list, grid, and map views without layout regressions.
- Open a listing from the results grid, verify hero image + key facts, and assert contact actions require authentication.

#### Account & identity
- Registration flow with server-side validation, e-mail confirmation stub, and secure session cookie issuance (no tokens in `localStorage`).
- Login/logout including refresh resilience, CSRF token renewal, and session persistence across browser restarts.
- Password reset flow using seeded email fixtures.

#### Buyer journeys
- Save search with Botswana-specific geography context (district → area).
- Favorite/unfavorite properties and confirm persistence across sessions.
- Schedule a viewing by interacting with calendar picker; confirm slot creation in backend and email stub delivery.
- Start a rental application: capture draft state, resume after refresh, and submit.

#### Lessor/Agent flows
- Authenticated agent runs listing wizard: District → Area → Ward → Street selection, map auto-centering, and pin drag updates reverse-geocoded address.
- Upload media set (validate image count, type, and size) and ensure progress UI works on mobile.
- Publish listing, trigger 60-day auto-expiry simulation, and verify renew/unpublish flows.
- Confirm listing appears in search index with updated freshness score.

#### Services marketplace
- Navigate services categories (Architectural, Quantity Surveyor, Structural Engineering) using localized taxonomy.
- Open provider profile, request quote, and ensure provider receives webhook/email stub.

#### Admin utilities
- Approve/flag listings, moderate media/descriptions, and manage billing plans.
- Trigger search reindex/rebuild job and validate completion notifications.

### 2. Search, filters, and ranking (Integration + Contract Tests)
- Use Jest + Supertest for `/api/properties` and `/api/search`.
- Validate filter semantics (inclusive price ranges, bedroom/bathroom minimums, multi-select property types).
- Assert deterministic pagination across multiple fetches (no duplicates/missing items) and stable sort orders.
- Confirm ranking rules: featured listings boosted, freshness decay applied, proximity scoring relative to selected geography.
- Validate AI/NL query fallbacks (e.g., "3-bed under P6,000 in Tlokweng near schools") and ensure graceful degradation when AI services are disabled.
- Indexing job tests: add/update listing and assert search index updates within configured SLA (e.g., < 10 seconds) using polling helper.

### 3. Location hierarchy & geospatial accuracy
- Data integrity tests over seeded Botswana hierarchy (District → Town/Village → Ward → Street) ensuring uniqueness, no orphans, and centroid availability.
- Geofence validation: property coordinates must fall within selected area polygon; fail fast and surface actionable error.
- Playwright map UX checks: selecting District centers map on centroid; selecting Area snaps pin; manual drag updates address fields via reverse geocoding; offline fallback retains coordinate entry.

### 4. Media & forms
- Automated tests for uploader constraints (file size/type, EXIF stripping, aspect ratio hints) and progressive loading placeholders.
- Wizard persistence tests: step validation, required fields, numeric constraints (price >= 0, beds > 0), and state recovery on refresh or network blip.

### 5. Payments & plans
- Entitlement tests covering plan limits (max listings, premium boosts) and 60-day auto-expiry.
- Renew/reactivate coverage including grace periods.
- Stripe availability toggle: if Botswana payment rails unavailable, hide paywall, surface "Contact sales" CTA, and assert analytics event.

### 6. Notifications
- Integration tests with email/push/webhook stubs verifying payloads and ensuring no secrets leak to logs.
- Rate-limiting and spam/malware scans validated against seeded malicious content.

---

## Part B — Non-Functional Test Strategy

### 1. Performance & reliability
- **Lighthouse CI**: enforce LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 on mid-range mobile (Moto G4 profile) over 4G, covering property list, property detail, and services category pages with media-heavy scenarios (20/50/100 images).
- **k6 load tests**: `/api/properties` and `/api/search` with mixed cached/uncached distribution (10% warm, 90% cold). Targets: p95 ≤ 300ms @ 50 RPS, ≤ 500ms @ 150 RPS. Conduct 1-hour soak @ 50 RPS with < 0.1% error rate and monitor memory.
- **Resilience drills**: simulate database failover (read-only mode), Google Maps outage (fallback to static map & manual coordinate entry), and AI service disablement. Capture runbooks for expected degradations.

### 2. Security
- **SAST**: Semgrep ruleset tuned for Node/React/Express/Drizzle.
- **Dependency audits**: `npm audit` and OWASP dependency check for both client and server packages.
- **DAST**: OWASP ZAP baseline scan against preview environment, gating merges on high severity issues.
- **Auth hardening**: ensure HttpOnly/Secure/SameSite cookies, CSRF tokens for state-changing requests, and server-side RBAC. Add regression tests for privilege escalation.
- **Secrets management**: enforce `.env` usage via GitHub encrypted secrets; ensure build output excludes secrets and Google Maps tokens restricted to BeeDab domains.

### 3. Accessibility (WCAG 2.1 AA)
- Combine Playwright with Axe for automated accessibility assertions: labels, alt text, keyboard navigation (filters, gallery, map controls).
- Manual audits for color contrast using BeeDab palette and pointer target sizes.

### 4. SEO & content quality
- Validate SSR/SSG output for landing, property, and services pages; ensure canonical URLs, Open Graph/Twitter cards, and `RealEstateListing` structured data.
- Verify sitemap and robots directives via integration tests; guard against thin or duplicate content with content linting.

---

## Part C — Benchmarking BeeDab vs Best-in-Class

### 1. Benchmark criteria
Compare BeeDab UX and capabilities against global leaders (Zillow/Redfin) adapted for Botswana data/payments:
- Search UX (facet design, instant apply, saved search, typo tolerance, NL queries).
- Map UX (pin/centroid behavior, draw-on-map, clustering, lazy loading).
- Listing cards (media speed, key facts, freshness labels, trust signals).
- Property details (gallery, floorplans, neighborhood context, commute times, schools and local amenities).
- Performance (Core Web Vitals, API p95 latencies).
- Trust & safety (moderation, fraud prevention, freshness).
- Monetization & ops (plan limits, renewals, bulk upload, agent tooling).

### 2. Scorecard framework
Populate a weighted scorecard after each major release using Lighthouse CI, Playwright traces, k6 reports, and Axe results:

| Category | Weight | BeeDab Score (0–5) | Target (Zillow/Redfin) | Gap | Fix Now? |
| --- | --- | --- | --- | --- | --- |
| Search & Filters | 20% |  |  |  |  |
| Map & Geo UX | 15% |  |  |  |  |
| Listing Cards | 10% |  |  |  |  |
| Property Details | 15% |  |  |  |  |
| Performance (CWV) | 15% |  |  |  |  |
| Security | 10% |  |  |  |  |
| Accessibility | 5% |  |  |  |  |
| SEO/Content | 5% |  |  |  |  |
| Monetization & Ops | 5% |  |  |  |  |

Document evidence for each score in release notes.

---

## Part D — Implementation Details to Add to Repo

1. **Playwright smoke suite** (to be expanded):
   - `tests/playwright/search.spec.ts`: search flow verifying Botswana districts (e.g., South East → Tlokweng), filters, view switches, first listing assertions.
   - `tests/playwright/listing-create.spec.ts`: authenticated agent wizard covering centroid snap, map drag, reverse-geocode, 8-photo upload, publish.
   - `tests/playwright/favorites-savedsearch.spec.ts`: save search (with email stub), favorite toggles, persistence checks.

2. **k6 load tests** located under `tests/load/`: template script hitting `/api/properties` with mixed filter payloads and thresholds for latency/error budgets.

3. **Lighthouse CI** configuration targeting property list, detail, and services category pages under mobile emulation. Fail the pipeline when budgets exceed defined thresholds.

4. **Security automation**:
   - Add Semgrep and OWASP ZAP GitHub Actions jobs (artifacts uploaded as HTML reports).
   - Fail builds on high severity findings; track suppressions via code owners review.

5. **Botswana data integrity tests**: Jest suite validating location hierarchy CSV/JSON seeds (unique IDs, parent/child integrity, centroid presence) and executed whenever seed data changes.

---

## Part E — Accelerated 4-Week Rollout Plan

### Week 1: Baseline & hardening
- Replace any residual `localStorage` auth usage with HttpOnly cookies; implement CSRF tokens & RBAC guards.
- Land core Playwright smoke tests, Semgrep, ZAP, and Lighthouse CI workflows in GitHub Actions.
- Fix migrations/seeds to ensure deterministic `npm run db:push` and `npx tsx server/seed.ts` executions in CI.

### Week 2: Search & geo excellence
- Implement centroid snapping, reverse geocode updates, and polygon geofence validation in listing wizard.
- Tune search ranking (featured boosts, recency decay, distance scoring) and back them with integration tests.
- Add indexing job monitoring, retries, and alerting hooks.

### Week 3: Performance & mobile polish
- Introduce image CDN integration, responsive source sets, and network hints (`preconnect`, `prefetch`).
- Optimize INP/LCP via skeleton states, virtualization, and caching strategies.
- Address Axe accessibility findings and add SEO structured data for key templates.

### Week 4: Monetization & ops
- Enforce auto-expiry at 60 days with renew workflow and plan caps.
- Launch bulk listing "Contact sales" path for Botswana payments landscape.
- Build admin moderation dashboard with audit trails and notifications.

---

## Part F — Immediate Differentiators to Emulate

- Instant facet application with filter chips and zero-click updates.
- Draw-on-map search (rectangle MVP evolving toward custom polygons).
- "New today" and "Price dropped" badges to increase repeat engagement.
- Saved-search email digests (daily/weekly) with Botswana-compliant delivery.
- Trust cues: agent verification badges, freshness timers, view counts (rate limited).
- Neighborhood context: schools/wards, commute estimates to Gaborone CBD, flood-plain/zoning notes when available.

---

## Deliverables & Success Signals

- CI badges covering Playwright, Lighthouse CI, Semgrep, ZAP, and k6 with pass/fail gates visible in README.
- Fully populated benchmarking scorecard with traceable metrics.
- Production readiness checklist spanning security, performance, data quality, and observability.
- Prioritized gap backlog ranked by ROI to close remaining distance to world-class UX.

---

## Implementation Status (Automation Hooks Landed)

- ✅ **Playwright**: API-driven smoke suites for anonymous discovery, agent listing lifecycle, buyer engagement, and accessibility audits (`tests/playwright/**`). Configured for Chromium/Firefox/WebKit across 390/768/1440px viewports with traces retained on failure.
- ✅ **Load & resilience**: `tests/load/properties-search.js` exercises `/api/properties` with mixed cached/cold queries under 50 RPS budgets, exportable through the k6 GitHub Action.
- ✅ **Performance budgets**: `lighthouserc.json` enforces mobile CWV thresholds (LCP ≤2.5s, CLS ≤0.1, INP proxy via TBT) for property list/detail and services catalog routes.
- ✅ **Security & quality gates**: GitHub Actions workflows (`.github/workflows/*.yml`) now cover Playwright E2E, Lighthouse CI, Semgrep SAST, OWASP ZAP baseline DAST, and nightly k6 smoke runs, each persisting artifacts for triage.
- ✅ **Test scripts**: npm scripts (`test:e2e`, `test:axe`, `test:load:k6`) align local developer ergonomics with CI automation.

