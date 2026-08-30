import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql, hasDatabase } from '../lib/neon.js';

const root=path.dirname(fileURLToPath(import.meta.url));
async function staticCount(){try{const raw=await fs.readFile(path.join(root,'..','data','products.json'),'utf8');const data=JSON.parse(raw);return Array.isArray(data.products)?data.products.length:0}catch{return 0}}
async function dbReachable(){if(!hasDatabase())return false;try{await sql`select 1`;return true}catch{return false}}
export default async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({ok:false,error:'method_not_allowed'});
  const [staticProducts, databaseReachable]=await Promise.all([staticCount(),dbReachable()]);
  const configured={database:Boolean(process.env.DATABASE_URL),auth:Boolean(process.env.NEON_AUTH_URL),ai:Boolean(process.env.GEMINI_API_KEY),affiliate:process.env.AFFILIATE_CONFIGURED==='true',admin:Boolean(process.env.ADMIN_TOKEN)};
  const gates=[
    {id:'frontend',label:'Public frontend',ready:true},
    {id:'catalog',label:'Catalog available',ready:staticProducts>0||databaseReachable},
    {id:'database',label:'Production database',ready:databaseReachable},
    {id:'auth',label:'Authentication configuration',ready:configured.auth},
    {id:'ai',label:'AI recommendation backend',ready:configured.ai},
    {id:'affiliate',label:'Affiliate routing configuration',ready:configured.affiliate},
    {id:'admin',label:'Admin authentication secret',ready:configured.admin}
  ];
  const ready=gates.every(g=>g.ready);
  res.status(200).json({ok:true,ready,environment:process.env.VERCEL_ENV||'unknown',timestamp:new Date().toISOString(),static_products:staticProducts,database_reachable:databaseReachable,configured,gates,policy:'Commercial launch requires every applicable gate to be verified; fallback/demo data must not be presented as live commerce verification.'});
}
