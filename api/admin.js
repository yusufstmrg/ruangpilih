import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql, hasDatabase } from '../lib/neon.js';

const root=path.dirname(fileURLToPath(import.meta.url));
async function fallbackSummary(){const raw=await fs.readFile(path.join(root,'..','data','products.json'),'utf8');const data=JSON.parse(raw);const products=Array.isArray(data.products)?data.products:[];return {products:products.length,verified:products.filter(p=>p.status==='VERIFIED').length,events:0,searches:0,product_views:0,saves:0,route_clicks:0,users:0}}
function integrations(){return {database:Boolean(process.env.DATABASE_URL),auth:Boolean(process.env.NEON_AUTH_URL),ai:Boolean(process.env.GEMINI_API_KEY),affiliate:process.env.AFFILIATE_CONFIGURED==='true'}}
export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({ok:false,error:'method_not_allowed'});
  if(!process.env.ADMIN_TOKEN||req.headers['x-admin-token']!==process.env.ADMIN_TOKEN) return res.status(401).json({ok:false,error:'unauthorized'});
  try{
    if(!hasDatabase()) return res.status(200).json({ok:true,mode:'static-fallback',environment:process.env.VERCEL_ENV||'unknown',integrations:integrations(),summary:await fallbackSummary()});
    const [a,b,c,d,e]=await Promise.all([sql`select count(*)::int n from rp_products where coalesce(editorial_status,'')<>'ARCHIVED'`,sql`select count(*)::int n from rp_products where status='VERIFIED'`,sql`select count(*)::int n from rp_events`,sql`select count(*)::int n from rp_events where event_name='search'`,sql`select count(*)::int n from rp_events where event_name='product_view'`]);
    const [f,g,h]=await Promise.all([sql`select count(*)::int n from rp_events where event_name='save_toggle' and (metadata->>'saved')='true'`,sql`select count(*)::int n from rp_events where event_name='affiliate_route_selected'`,sql`select count(distinct session_id)::int n from rp_events where session_id is not null`]);
    return res.status(200).json({ok:true,mode:'neon',environment:process.env.VERCEL_ENV||'unknown',integrations:integrations(),summary:{products:a[0].n,verified:b[0].n,events:c[0].n,searches:d[0].n,product_views:e[0].n,saves:f[0].n,route_clicks:g[0].n,users:h[0].n}})
  }catch(error){console.error(error);try{return res.status(200).json({ok:true,mode:'static-fallback',environment:process.env.VERCEL_ENV||'unknown',integrations:integrations(),summary:await fallbackSummary()})}catch{return res.status(503).json({ok:false,error:'admin_data_unavailable'})}}
}
