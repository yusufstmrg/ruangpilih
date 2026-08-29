# RuangPilih Production Status

## Current state
The public RuangPilih experience is deployed on Vercel and has been redesigned to follow the approved dark navy + gold direction from the founder mockup. The repository main branch includes the public recommendation experience, bundled catalog fallback, Product Intelligence detail flow, comparison workflow, AI recommendation endpoint foundation, event capture, protected Admin OS, security headers, smoke tests, and automated full-source ZIP packaging.

## Verified in production
- Public homepage returns HTTP 200.
- `/api/health` returns HTTP 200.
- `/api/catalog` returns the bundled Product Intelligence fallback catalog when `DATABASE_URL` is not configured.
- Latest GitHub CI run passed `npm test` and JavaScript syntax checks.
- Full production source package is generated as a GitHub Actions artifact.

## Remaining launch gates outside source-code completion
These items require real production credentials, external account configuration, legal/company decisions, or real-world commercial validation and therefore cannot be truthfully completed from source control alone:

1. `DATABASE_URL` — connect the production Neon database and run the current schema.
2. `GEMINI_API_KEY` — enable production AI recommendations.
3. `ADMIN_TOKEN` — set the secured production token for Admin OS.
4. `AFFILIATE_CONFIGURED=true` plus real approved affiliate account/link configuration.
5. Verify and approve real product facts, evidence, freshness, pricing/availability claims, and outbound affiliate routes before publication.
6. Complete authentication/customer identity if account-based persistence is required.
7. Final company/contact/legal entity data and legal pages (Privacy, Terms, Affiliate Disclosure, Contact).
8. Final primary domain connection and canonical-domain validation.
9. Production performance/accessibility/SEO audit on the final domain.
10. Commercial launch QA: end-to-end click tracking, affiliate attribution, reconciliation, merchant route health, and correction workflow.

## Important trust rule
RuangPilih must not invent current price, stock, ratings, reviews, technical facts, affiliate status, or partner relationships. Unverified records stay clearly marked until evidence and commerce routes are verified.
