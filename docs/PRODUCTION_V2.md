# RuangPilih Production V2

This release upgrades the public site from a static demo shell toward the Business Plan v2 decision-intelligence architecture.

## Implemented foundation
- Premium RuangPilih visual system using the approved black/white/gold identity.
- Product Intelligence data model and database foundation on Neon PostgreSQL.
- Public catalog API with database-first loading and safe static fallback.
- Canonical category and guide seed data.
- Search, category filters, product detail, save, compare, and telemetry flows.
- Recommendation API with Gemini as the primary model and deterministic local fallback when AI credentials are unavailable.
- Production health endpoint exposing database/auth/AI/affiliate readiness without leaking secrets.
- Event ingestion endpoint with Neon persistence when configured and runtime-log fallback otherwise.
- Initial Admin OS command-center foundation covering Product Intelligence, Affiliate Intelligence, Research, Analytics, Customer 360, Editorial, Partners/CRM, Connector Health, Recommendation Lab, Trust/Compliance, Settings, and Data Imports.
- Multi-network affiliate registry with Shopee as the initial primary route and configurable fallback sequence.
- Customer 360, CRM, analytics, evidence, research, compliance, campaign, partner, connector, audit, and recommendation schema foundations.
- Neon Auth provisioned for future account, personalization, Saved/Wishlist, and Admin RBAC flows.
- Security headers, robots policy, sitemap, JSON-LD, and production SEO foundation.

## Affiliate routing policy
1. Start with Shopee when an eligible, verified, healthy route exists.
2. If Shopee is unavailable, materially unsuitable, stale, unverified, or otherwise fails the route policy, evaluate the next eligible marketplace/network.
3. Marketplace routing is separate from product ranking. Commission cannot overrule user fit, quality, trust, practical proof, value, or freshness.
4. Every commercial route must preserve affiliate disclosure and link-health status.

## AI policy
- Primary provider: Gemini API.
- Recommended default model for complex recommendation reasoning: `gemini-2.5-pro`.
- High-volume/low-latency future workloads can use `gemini-2.5-flash` where appropriate.
- The AI may not invent price, stock, rating, reviews, specifications, tests, or evidence.
- Verified Intelligence and Live Discovery remain separate modes.

## External gates still required before full commercial launch
- Primary domain `ruangpilih.com` configured in Vercel and DNS.
- Defensive domain `ruangpilih.id` acquired and redirected to the primary domain.
- Vercel `DATABASE_URL` and `NEON_AUTH_URL` configured as environment variables.
- Gemini API key configured as a Vercel secret.
- Official affiliate credentials/API/OAuth for Shopee and subsequent marketplaces/networks.
- Final legal/entity/contact content and publication policies.
- Admin authentication/RBAC verification in the production environment.
- Authorized live-research connectors.

## Important trust rule
Never fabricate price, stock, ratings, reviews, specifications, tests, or affiliate status. A recommendation must preserve evidence/status metadata and commission must never override product fit.
