# RuangPilih Platform Architecture v2

This build is the production-facing frontend foundation for Master Business Plan v2.0.

## Current implementation
- Data-driven product catalog loaded from `data/products.json`.
- Natural-language search UI and local fit ranking.
- Product detail, compare, save/wishlist interactions.
- Trust/evidence presentation and affiliate disclosure.
- SEO metadata, canonical URL, JSON-LD, robots and sitemap.
- Affiliate destination is represented as data, not hard-coded into UI components.
- AI Decision Assistant UI is intentionally marked as a foundation/preview until authorized AI and live-research services are connected.
- Supabase/Postgres schema is provided in `supabase_schema.sql` for the Product Intelligence Database v3.

## Target service boundaries
Frontend -> API Gateway -> Application Services -> Product Intelligence DB + Search/Semantic Layer + Affiliate Connector Layer + AI Research Orchestrator + Analytics/Event Warehouse.

## Non-negotiables
1. Never fabricate product facts, reviews, price, stock or testing.
2. Store evidence URLs and timestamps for material claims.
3. Commission must never override product-fit ranking.
4. Affiliate routes must resolve through a link service once backend is active.
5. Connectors must be independently switchable.
6. Live research can discover products outside the database.
7. AI output must distinguish database retrieval from live research.
