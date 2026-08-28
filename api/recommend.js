function localRank(query, products) {
  const terms = String(query).toLowerCase().split(/\s+/).filter(Boolean);
  return products.map(p => {
    const hay = [p.name, p.brand, p.category, p.model, p.problem_solved, ...(p.use_cases || []), ...(p.subcategories || [])].join(' ').toLowerCase();
    const matches = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
    const verified = p.status === 'VERIFIED';
    const active = p.affiliate?.status === 'VERIFIED_ACTIVE';
    return { p, score: matches + (verified ? 0.25 : 0) + (active ? 0.1 : 0) };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).slice(0, 5);
}

function extractText(payload) {
  return payload?.candidates?.flatMap(c => c?.content?.parts || [])?.map(p => p.text || '').join('') || '';
}

function safeJson(text) {
  try { return JSON.parse(text); } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) { try { return JSON.parse(match[0]); } catch {} }
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  let body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); } catch { return res.status(400).json({ ok: false, error: 'invalid_json' }); }
  const query = String(body?.query || '').trim();
  const products = Array.isArray(body?.products) ? body.products : [];
  if (!query) return res.status(400).json({ ok: false, error: 'query_required' });

  if (!process.env.GEMINI_API_KEY) {
    const ranked = localRank(query, products);
    return res.status(200).json({
      ok: true,
      mode: 'local',
      title: ranked.length ? 'Shortlist awal' : 'Research signal',
      summary: ranked.length ? 'Kandidat ditemukan dari Product Intelligence yang tersedia.' : 'Belum ada kandidat yang cocok. Query dicatat sebagai research signal.',
      recommendations: ranked.map(({ p }) => ({ name: p.name, why: p.problem_solved, status: p.status })),
      disclosure: 'Gemini belum terhubung. Hasil hanya menggunakan data lokal dan tidak boleh dianggap sebagai live research.'
    });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
  const prompt = `You are the RuangPilih recommendation intelligence assistant.\nUser need: ${query}\n\nCatalog data:\n${JSON.stringify(products).slice(0, 80000)}\n\nReturn JSON only with keys: title, summary, recommendations. recommendations must be an array of objects with name, why, tradeoffs, whoShouldAvoid, status.\nRules: prioritize User Fit and Quality/Usefulness; then Trust, Practical Proof, Value/Economics, Freshness/Availability. Never invent price, stock, rating, review, specification, test result or source. Treat PENDING_VERIFICATION as unverified. Affiliate commission must never override material user fit. Recommend only catalog products unless the query cannot be answered; in that case return an empty recommendations array and say that live research is required.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.15 }
      })
    });
    if (!response.ok) throw new Error(`Gemini ${response.status}`);
    const payload = await response.json();
    const parsed = safeJson(extractText(payload));
    if (!parsed) throw new Error('gemini_invalid_json');
    return res.status(200).json({
      ok: true,
      mode: 'gemini',
      ...parsed,
      disclosure: 'AI output is grounded in the provided Product Intelligence catalog. Live research and offer verification remain separate steps.'
    });
  } catch (error) {
    console.error('recommend_error', error);
    const ranked = localRank(query, products);
    return res.status(200).json({
      ok: true,
      mode: 'local-fallback',
      title: ranked.length ? 'Shortlist awal' : 'Research signal',
      summary: ranked.length ? 'AI sedang tidak tersedia; menggunakan local Product Intelligence fallback.' : 'Belum ada kandidat lokal; kebutuhan ini masuk research queue.',
      recommendations: ranked.map(({ p }) => ({ name: p.name, why: p.problem_solved, status: p.status })),
      disclosure: 'Gemini request gagal. Tidak ada fakta baru yang dibuat atau dipublikasikan.'
    });
  }
}
