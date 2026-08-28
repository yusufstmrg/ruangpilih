# RuangPilih Affiliate Routing Policy v1

## Purpose
RuangPilih uses affiliate commerce as a monetization layer, while recommendation quality remains primary. The default merchant strategy is **Shopee-first** for Indonesia, followed by approved fallback merchants/networks when the requested item is unavailable, materially worse, insufficiently verified, or otherwise fails the recommendation threshold.

## Routing hierarchy
1. **Shopee** — preferred merchant when a suitable, sufficiently verified offer exists.
2. **TikTok Shop** — fallback when it materially improves availability, price/value, fit, or verification.
3. **Tokopedia** — fallback under the same principles.
4. **Lazada** — fallback.
5. **Blibli** — fallback.
6. **Approved affiliate networks / direct merchants** — fallback or specialist route.

## Important rule
Merchant priority is a routing preference, **not a recommendation override**. A Shopee offer must not win merely because it is easier to monetize. If another eligible offer is materially better for the user's need, RuangPilih may recommend that alternative.

## Verification states
- `verified`: sufficient evidence and commerce route checked.
- `pending_verification`: known candidate but not enough evidence to recommend as a verified pick.
- `stale`: evidence or commerce data is outside freshness policy.
- `blocked`: connector, merchant, legal, or trust issue prevents routing.

## Recommendation requirements
Every commerce recommendation should preserve:
- canonical product/service identity;
- user-fit rationale;
- evidence/source metadata;
- freshness timestamp;
- price/availability timestamp where applicable;
- affiliate disclosure where applicable;
- direct route to the best eligible merchant offer.

## Disclosure
Affiliate links must be transparently disclosed. Commercial relationships must not determine the editorial verdict.

## Future routing score
The platform may rank merchant offers using eligibility, trust, price/value, availability, shipping/market coverage, commission, and link health. Commission remains a secondary business variable and may not override material user-fit or trust signals.
