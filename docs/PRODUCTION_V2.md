# RuangPilih Production V2

This release upgrades the public site from a static demo shell toward the Business Plan v2 architecture.

## Implemented in this release
- Premium RuangPilih visual system using the approved black/white/gold identity.
- Product Intelligence data loaded from `/data/products.json` rather than hard-coded product cards.
- Canonical category and guide seed data.
- Search, category filters, product detail, save, compare, and telemetry flows.
- AI Decision Assistant endpoint with a safe local fallback when no OpenAI key is configured.
- Production health endpoint.
- Event ingestion endpoint with server-runtime fallback.
- Initial Admin OS command-center shell.
- Multi-network affiliate registry for Indonesia-first launch.
- Product Intelligence / Customer 360 / Affiliate Intelligence Supabase schema foundation.
- Security headers, robots policy, and production SEO foundation.

## External gates still required
- `ruangpilih.com` DNS and Vercel domain configuration.
- Production Supabase project and secured environment variables.
- Approved affiliate publisher/API credentials for each network.
- Final legal/entity/contact content.
- Production authentication and RBAC for Admin OS.
- Authorized live-research connectors.

## Important trust rule
Never fabricate price, stock, ratings, reviews, specifications, tests, or affiliate status. A recommendation must preserve evidence/status metadata and commission must never override product fit.
