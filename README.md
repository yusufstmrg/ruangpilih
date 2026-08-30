# RuangPilih — Recommendation Intelligence Platform

**Public promise:** Helping You Choose with Confidence.

**Internal north star:** Indonesia's Most Trusted Recommendation Platform.

## Production foundation
- Premium responsive public homepage and decision-first UX.
- Search, category navigation, Smart Picks, product detail, save and compare flows.
- Product Intelligence API with Neon-backed mode and bundled static fallback.
- Recommendation API with local catalog reasoning and optional Gemini backend.
- Affiliate routing API with verification-aware destination selection.
- Event collection with durable Neon mode and runtime-log fallback.
- Admin OS with token-gated dashboard and launch-gate visibility.
- SEO metadata, robots and sitemap baseline.
- Automated GitHub smoke tests and syntax checks.

## Current launch policy
RuangPilih must not present demo/static data as live verified commerce data. Current catalog and affiliate records are explicitly verification-aware. Commercial launch requires production secrets, database reachability, authentication, AI configuration, affiliate configuration, admin authentication, live offer checks, analytics, legal/disclosure approval, and final domain configuration.

## Required production configuration
Store credentials only in Vercel Environment Variables. The repository contains `.env.example` as a configuration map and never as a secret store.

Required variables:
- `DATABASE_URL`
- `NEON_AUTH_URL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `ADMIN_TOKEN`
- `AFFILIATE_CONFIGURED=true` only after authorized affiliate routing is actually configured and tested
- `PUBLIC_BASE_URL`

## Operational endpoints
- `/api/health` — runtime integration health.
- `/api/readiness` — launch-gate status.
- `/api/catalog` — Product Intelligence catalog.
- `/api/recommend` — recommendation backend.
- `/api/route` — commerce routing.
- `/api/event` — analytics/event capture.
- `/api/admin` — authenticated Admin OS summary.

## Development principle
Do not mark the product commercially production-ready until the applicable launch gates are verified end-to-end in production. UI availability alone is not considered business readiness.
