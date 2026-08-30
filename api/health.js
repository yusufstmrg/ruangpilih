import { sql, hasDatabase } from '../lib/neon.js';

export default async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'method_not_allowed'});
  let database=false;
  if(hasDatabase()){try{await sql`select 1`;database=true}catch{database=false}}
  const auth=Boolean(process.env.NEON_AUTH_URL);
  const ai=Boolean(process.env.GEMINI_API_KEY);
  const affiliate=process.env.AFFILIATE_CONFIGURED==='true';
  const admin=Boolean(process.env.ADMIN_TOKEN);
  const critical=database&&auth&&ai&&affiliate&&admin;
  res.status(200).json({ok:true,service:'ruangpilih',environment:process.env.VERCEL_ENV||'unknown',timestamp:new Date().toISOString(),integrations:{database,auth,ai,affiliate,admin},launch_ready:critical,routing:{primary_marketplace:'Shopee',fallback_sequence:['TikTok Shop','Tokopedia','Lazada','Blibli','Affiliate Networks','Direct Merchant']}});
}
