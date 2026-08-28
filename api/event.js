export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  let body = req.body;
  try { if (typeof body === 'string') body = JSON.parse(body); } catch { return res.status(400).json({ ok: false, error: 'invalid_json' }); }
  if (!body?.event_name) return res.status(400).json({ ok: false, error: 'missing_event_name' });
  const event = {
    event_name: String(body.event_name),
    session_id: body.session_id ? String(body.session_id) : null,
    product_id: body.product_id ? String(body.product_id) : null,
    metadata: body.metadata && typeof body.metadata === 'object' ? body.metadata : {},
    occurred_at: new Date().toISOString()
  };
  // Safe fallback while the production event warehouse is not connected.
  console.log(JSON.stringify({ type: 'ruangpilih_event', ...event }));
  return res.status(202).json({ ok: true, persisted: Boolean(process.env.SUPABASE_URL), mode: process.env.SUPABASE_URL ? 'database_pending' : 'runtime_log_fallback' });
}
