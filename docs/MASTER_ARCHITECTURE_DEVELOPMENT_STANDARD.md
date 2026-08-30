# RuangPilih — Master Architecture + Development Standard

**Version:** 1.0 — 30 August 2026  
**Public promise:** Helping You Choose with Confidence  
**Internal North Star:** Indonesia's Most Trusted Recommendation Platform

## 1. Strategic identity

RuangPilih is a recommendation technology and media company designed to become the decision layer between consumers and commerce. It is not an affiliate catalog. The user states a need; RuangPilih researches, compares, explains trade-offs, recommends best-fit choices, and routes the user to the best available buying route.

Core moat: trust + methodology + Product Intelligence Graph + behavioral data + distribution + affiliate infrastructure.

Architecture scope: products, services, software, tools, experiences and solutions. Indonesia-first go-to-market; architecture global-ready.

## 2. Canonical system layers

1. Public Experience — Home, Search, Category Hubs, Detail Pages, Compare, Buying Guides, Smart Finds, AI Decision Assistant, Saved/Wishlist, Trust Center, About, Contact, Legal.
2. Product/Service Intelligence — canonical entities, brands, categories, attributes, use cases, listings, sellers, price, stock, reviews, evidence and freshness.
3. Recommendation Engine — intent extraction, constraint normalization, retrieval, research, evidence, entity resolution, scoring, explanation and feedback.
4. Affiliate Intelligence — networks, merchants, programs, offers, deep links, eligibility, commission, region, route health and attribution.
5. Customer 360 — identity, preferences, consent, search/view/save/compare/recommendation history, clicks and attributed outcomes.
6. Admin OS — Product Intelligence, Affiliate Intelligence, Research Console, Recommendation Lab, CRM, Customer 360, Content, SEO, Analytics, Trust/Compliance, Connector Health and System.
7. Analytics/Event Layer — sessions, search, recommendation, product view, compare, save, outbound click, conversion, feedback, link health and KPI aggregation.
8. Trust/Governance — source, timestamp, evidence, confidence, corrections, disclosures, audit trails and sensitive-category controls.

## 3. Target application architecture

```text
User / SEO / Social
        |
        v
Next.js Web Experience
        |
        v
API / BFF / Gateway
(Auth, validation, rate limits, observability, feature flags)
        |
        +--> Search Service
        +--> Product Intelligence Service
        +--> Research Orchestrator
        +--> Recommendation Engine
        +--> Affiliate / Commerce Router
        +--> Customer 360 / CRM
        +--> Analytics / Attribution
        |
        +--> Neon PostgreSQL (system of record)
        +--> Semantic / vector search layer
        +--> Object storage
        +--> Gemini AI gateway
        +--> Affiliate connector adapters
```

## 4. Recommended production stack

| Layer | Standard |
|---|---|
| Application | Next.js + React + TypeScript; use current supported LTS/security line when implementing |
| UI | Tailwind CSS + shadcn/ui; design tokens and reusable components |
| Database | Neon PostgreSQL |
| ORM | Prisma ORM or equivalent typed PostgreSQL ORM |
| Auth | Neon Auth + application RBAC |
| AI | Gemini API; Gemini Pro class for complex reasoning; Flash class for high-volume low-latency work |
| Search | PostgreSQL FTS initially; optional Algolia for scale; semantic embeddings/vector layer |
| Hosting | Vercel |
| Source | GitHub |
| CI/CD | GitHub Actions + Vercel previews/production |
| Validation | Zod |
| Analytics UI | Recharts or equivalent |
| Email | Resend when activated |
| Payments | Stripe for future premium tools/subscriptions |
| Media | UploadThing/object storage adapter |
| Motion | Framer Motion with reduced-motion support |
| Testing | Unit + integration + Playwright E2E |
| Monitoring | Vercel observability; Sentry optional for expanded error tracking |

## 5. Brand and UX standard

Visual direction: premium dark navy/black + gold + white; RuangPilih open-door/checkmark identity; elegant, restrained, readable, high-trust. The accepted homepage mockup is the visual direction: premium navigation, need-first hero, golden door/checkmark, AI Assistant, Smart Picks, comparison module, article/guide module, deals, trusted affiliate ecosystem, capability bar, newsletter, footer and mobile-first behavior.

Do not alter brand promise, core hierarchy or trust posture without founder approval. Use problem-led copy rather than commission-led copy.

## 6. Recommendation methodology

Default indicative weights:
- User fit 25%
- Quality/usefulness 25%
- Trust 15%
- Content/practical proof 10%
- Value/economics 15%
- Freshness/availability 10%

Weights are configurable per category. Health, finance and other safety-sensitive categories require stronger evidence/trust thresholds.

**Non-negotiable:** higher affiliate commission must never make a materially worse product outrank a better-fit product.

## 7. AI decision flow

```text
Need / budget / location / preferences / constraints / product link
  -> intent extraction
  -> constraint normalization
  -> known-candidate retrieval
  -> permitted live discovery
  -> evidence collection
  -> entity resolution
  -> trust/compliance gate
  -> scoring
  -> comparison
  -> explanation
  -> commerce route resolution
  -> response + disclosure + sources
  -> feedback / learning
```

AI modes:
- **Verified Intelligence:** only verified database/evidence-backed facts.
- **Live Discovery:** discovers new/current candidates outside the DB, but every published recommendation must preserve evidence and timestamp metadata.

AI output should support: Best overall, Best value, Best for use case, Best budget, Best premium, Alternative, Why recommended, Trade-offs, Who should avoid, Current price/availability context, Where to buy, Affiliate disclosure, Sources/evidence.

## 8. Product intelligence data model

Canonical entities: Product, Variant, Brand, Category, Subcategory, Use Case, Attribute, Merchant/Seller, Marketplace, Listing, Affiliate Program, Affiliate Offer, Affiliate Link, Evidence, Claim, Product Score, Recommendation, Performance Event.

Every canonical product must have a stable `product_id` independent of marketplace listing IDs. Listings map to canonical entities; uncertain entity matches are quarantined for review.

Status taxonomy:
`VERIFIED_ACTIVE`, `VERIFIED_INACTIVE`, `PENDING_VERIFICATION`, `REGION_RESTRICTED`, `CAMPAIGN_ONLY`, `NOT_ELIGIBLE`, `UNKNOWN`, `EXPIRED`.

Target refresh:
- affiliate terms/commission: monthly + event-driven
- price/stock: daily; more often for high-volume SKUs
- ratings/reviews: daily/weekly according to source
- affiliate links: on use + scheduled health checks
- product facts: source change + periodic
- scores: on query + material change

## 9. Affiliate routing policy

RuangPilih is **Shopee-first**, not Shopee-only.

Preferred routing order:
1. Shopee
2. TikTok Shop
3. Tokopedia
4. Lazada
5. Blibli
6. affiliate networks such as ACCESSTRADE, Involve Asia, Admitad, impact.com
7. direct merchant/brand route

This order is a commerce-routing preference, not a product-ranking rule. A lower-commission route may win when it provides materially better fit, trust, availability, price/value or route quality.

Connector states: `ACTIVE`, `PENDING_SETUP`, `DISABLED`, `ERROR`.

Never hard-code affiliate URLs in UI components. Resolve through Affiliate Link Service / Commerce Router.

## 10. Marketplace/network integration standard

Use only official authorized mechanisms: OAuth, API keys, publisher credentials, service accounts, official deep-link tooling or approved affiliate dashboards. Never store marketplace passwords or automate private pages with user credentials.

Initial ecosystem targets: Shopee, TikTok Shop, Tokopedia, Lazada, Blibli, ACCESSTRADE, Involve Asia, Admitad, impact.com, and direct brands. Activate a connector only when the required account/credential and terms are available.

## 11. Customer 360 / CRM

Guest browsing must work without mandatory login. Registered users gain persistent saves, preferences, recommendation history and personalization subject to consent.

Customer 360 may contain:
- profile
- consent
- preferences
- interests/category affinity
- search history
- product views
- comparisons
- saves/wishlist
- recommendation history
- recommendation feedback
- outbound clicks
- attributed conversions where available

CRM modules: leads, customers, partners, brands, merchants, campaigns, communications, support.

## 12. Admin OS

Required modules:
- Command Center / Overview
- Product Intelligence
- Brand / Category Management
- Affiliate Intelligence
- Offers / Links / Commission
- Connector Health
- Research Console
- Evidence / Corrections
- Recommendation Lab / Methodology versions
- Customer 360
- CRM
- Content / Editorial
- SEO
- Analytics / Attribution
- Trust / Compliance
- Roles / Permissions
- Feature Flags
- Audit Log
- System / Settings

Admin must be able to disable a broken connector or offer and preserve an audit trail.

## 13. Analytics and event taxonomy

Core events: session_start, search, zero_result_search, category_select, product_view, compare_add, compare_remove, compare_open, save_add, save_remove, recommendation_request, recommendation_result, outbound_click, conversion, feedback, affiliate_link_health.

Core KPIs:
- qualified recommendation sessions
- search success / zero-result rate
- recommendation CTR
- affiliate conversion
- revenue/session
- returning users
- product freshness
- affiliate link health
- top 20% content revenue share
- contribution margin
- AI correction rate
- recommendation feedback

Do not lock aggressive revenue forecasts before 30–90 days of real traffic/conversion data.

## 14. Trust, evidence and compliance

Never fabricate reviews, usage experience, tests, prices, stock, specifications or other material facts. Do not claim “best” without explicit criteria. Store source URLs and timestamps for material claims. Show uncertainty when evidence is incomplete. Disclose affiliate and sponsorship relationships. AI claims require validation before publication. Preserve correction and audit trails.

Sensitive categories (health, finance, legal and similarly material areas) require elevated evidence, trust and compliance controls.

## 15. SEO / content / social

SEO surfaces:
- category and use-case pages
- comparison pages
- best-for pages
- evergreen buying guides
- structured data/schema where appropriate
- canonical product entities
- zero-result search mining

Content formats:
- Problem Solver
- Smart Find
- Comparison
- Buying Guide
- Life Hack
- Best Picks
- AI Video
- Threads Insight

Core social formula: **Problem Hook -> Insight -> Evidence -> Recommendation -> CTA**.

Channel roles: TikTok = reach/discovery; Instagram = trust/visual authority; Threads = conversation; website = owned SEO/intelligence; email/WhatsApp = retention.

## 16. Repository standard

Recommended rebuild structure:

```text
ruangpilih/
  app/
  components/
  features/
    search/
    recommendation/
    products/
    comparison/
    affiliate/
    research/
    customer360/
    crm/
    content/
    analytics/
  lib/
    db/
    auth/
    ai/
    search/
    scoring/
    connectors/
    trust/
    telemetry/
    security/
  prisma/
  public/
  content/
  tests/
    unit/
    integration/
    e2e/
  docs/
  .github/workflows/
```

## 17. Git / release standard

`main` is production source of truth. Use feature branches, pull requests, CI gates and Vercel preview deployments. No force push to main. Database migrations are versioned. Every release has a rollback path. Full production ZIP must be generated from the exact released commit.

## 18. Test standard

Minimum gates:
- unit tests for scoring/routing/normalization
- integration tests for DB and APIs
- auth/RBAC tests
- affiliate resolver tests
- Playwright E2E for search -> detail -> compare -> recommendation -> outbound route
- mobile/desktop regression
- accessibility audit
- SEO audit
- security/dependency audit
- performance checks
- data quality/evidence checks
- connector/link-health checks
- AI structured-output validation

## 19. Production definition of done

The platform is not “ready” merely because Vercel says READY. 100% launch readiness requires:

1. canonical product IDs and timestamps
2. authorized affiliate integrations and secure credentials
3. tested/monitored affiliate links
4. explainable recommendations
5. commission never overrides product fit
6. clear separation of database retrieval vs live research
7. non-affiliate labeling
8. disclosure/trust/legal pages live
9. measurable search and conversion events
10. admin connector/offer kill-switch
11. security, backup and monitoring
12. desktop/mobile critical-flow testing
13. SEO fundamentals
14. correction/update workflow
15. external TBDs resolved: domain, email, legal entity/contact, affiliate IDs, analytics configuration, legal copy
16. exact-release production ZIP

## 20. Business operating flywheel

`User Need -> AI / Research -> Product Intelligence -> Better Recommendation -> Click / Transaction -> Behavioral & Commerce Data -> Better Ranking -> More Trust -> More Users -> More Data`

## 21. Production links

- Primary domain: https://ruangpilih.com/
- Defensive domain: https://ruangpilih.id/
- Current Vercel: https://ruangpilih-platform.vercel.app/
- GitHub: https://github.com/yusufstmrg/ruangpilih

## 22. Manual rebuild instruction

An engineering team should treat the Master Business Plan v2.0 and this document as specification, not as a suggestion. Rebuild in controlled milestones, keep business rules in services/config instead of UI, preserve canonical IDs, never hard-code affiliate URLs, and verify each critical workflow end-to-end before moving the release to production.
