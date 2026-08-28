export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: 'ruangpilih',
    environment: process.env.VERCEL_ENV || 'unknown',
    timestamp: new Date().toISOString(),
    integrations: {
      database: Boolean(process.env.SUPABASE_URL),
      ai: Boolean(process.env.OPENAI_API_KEY),
      affiliate: Boolean(process.env.AFFILIATE_CONFIGURED)
    }
  });
}
