import { sql, hasDatabase } from '../lib/neon.js';

async function fallback(req) {
  const host = req.headers?.host;
  const proto = req.headers?.['x-forwarded-proto'] || 'https';
  const base = host ? `${proto}://${host}` : '';
  const response = await fetch(`${base}/data/products.json`, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error('fallback_catalog_unavailable');
  return await response.json();
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  try {
    if (!hasDatabase()) {
      return res.status(200).json({ ok: true, mode: 'static-fallback', ...(await fallback(req)) });
    }
    const rows = await sql()`
      select
        p.product_id, p.name, p.model, p.entity_type, p.description, p.problem_solved,
        p.status, p.editorial_status, p.currency, p.country_code, p.canonical_url, p.image_url,
        b.name as brand,
        c.name as category,
        coalesce((select json_agg(u.use_case order by u.priority asc) from rp_product_use_cases u where u.product_id = p.id), '[]'::json) as use_cases,
        coalesce((select json_agg(json_build_object('text', c2.claim, 'verification_status', c2.verification_status, 'confidence', c2.confidence)) from rp_claims c2 where c2.product_id = p.id), '[]'::json) as claims,
        coalesce((select json_agg(json_build_object('source_url', s.source_url, 'fact', e.fact, 'confidence', e.confidence, 'verified', e.verified, 'captured_at', e.captured_at) order by e.captured_at desc)
                  from rp_evidence e left join rp_sources s on s.id=e.source_id where e.product_id=p.id), '[]'::json) as evidence,
        coalesce((select min(l.price) from rp_listings l where l.product_id=p.id and l.status='VERIFIED'), null) as price
      from rp_products p
      left join rp_brands b on b.id=p.brand_id
      left join rp_categories c on c.id=p.category_id
      where p.editorial_status <> 'ARCHIVED'
      order by p.updated_at desc, p.name asc
      limit 2500
    `;
    return res.status(200).json({ ok: true, mode: 'neon', products: rows });
  } catch (error) {
    console.error('catalog_error', error);
    try {
      return res.status(200).json({ ok: true, mode: 'fallback-after-db-error', ...(await fallback(req)) });
    } catch {
      return res.status(503).json({ ok: false, error: 'catalog_unavailable' });
    }
  }
}
