function localRank(query, products) {
  const terms = String(query).toLowerCase().split(/\s+/).filter(Boolean);
  return products.map(p => {
    const hay = [p.name, p.brand, p.category, p.model, p.problem_solved, ...(p.use_cases || []), ...(p.subcategories || [])].join(' ').toLowerCase();
    const matches = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
    return { p, score: matches };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  let body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); } catch { return res.status(400).json({ ok: false, error: 'invalid_json' }); }
  const query = String(body?.query || '').trim();
  const products = Array.isArray(body?.products) ? body.products : [];
  if (!query) return res.status(400).json({ ok: false, error: 'query_required' });

  if (!process.env.OPENAI_API_KEY) {
    const ranked = localRank(query, products);
    return res.status(200).json({
      ok: true,
      mode: 'local',
      title: ranked.length ? 'Shortlist awal' : 'Research signal',
      summary: ranked.length ? 'Kandidat ditemukan dari Product Intelligence yang tersedia.' : 'Belum ada kandidat terverifikasi yang cocok. Query siap menjadi research signal.',
      recommendations: ranked.map(({ p }) => ({ name: p.name, why: p.problem_solved, status: p.status })),
      disclosure: 'Live AI research belum aktif. Hasil tidak boleh dipublikasikan sebagai fakta baru tanpa evidence/verification.'
    });
  }

  try {
    const instruction = `You are RuangPilih, an evidence-first recommendation assistant. User need: ${query}\n\nCatalog:\n${JSON.stringify(products).slice(0, 60000)}\n\nRules: prioritize fit and usefulness; never invent current price, stock, ratings, reviews, specifications or tests; explain trade-offs; label unverified items; affiliate economics can never override user fit. Return concise JSON with keys title, summary, recommendations (array with name, why, tradeoffs, whoShouldAvoid, status), disclosure.`;
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || 'gpt-5-mini', input: instruction })
    });
    if (!response.ok) throw new Error(`OpenAI ${response.status}`);
    const payload = await response.json();
    const text = payload.output_text || '';
    return res.status(200).json({ ok: true, mode: 'live', title: 'AI Recommendation', summary: text, recommendations: [], disclosure: 'AI output requires evidence validation before publication; affiliate economics never override product fit.' });
  } catch (error) {
    console.error('recommend_error', error);
    return res.status(502).json({ ok: false, error: 'ai_unavailable' });
  }
}
