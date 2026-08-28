export default async function handler(req, res) {
  res.status(200).json({
    ok: true,
    service: 'ruangpilih',
    environment: process.env.VERCEL_ENV || 'unknown',
    timestamp: new Date().toISOString(),
    integrations: {
      database: Boolean(process.env.DATABASE_URL),
      auth: Boolean(process.env.NEON_AUTH_URL),
      ai: Boolean(process.env.GEMINI_API_KEY),
      affiliate: process.env.AFFILIATE_CONFIGURED === 'true'
    },
    routing: { primary_marketplace: 'Shopee', fallback_sequence: ['TikTok Shop', 'Tokopedia', 'Lazada', 'Blibli', 'Affiliate Networks', 'Direct Merchant'] }
  });
}
