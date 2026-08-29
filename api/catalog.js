import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql, hasDatabase } from '../lib/neon.js';

const root=path.dirname(fileURLToPath(import.meta.url));
async function staticCatalog(){const raw=await fs.readFile(path.join(root,'..','data','products.json'),'utf8');const data=JSON.parse(raw);return Array.isArray(data.products)?data.products:[]}

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({ok:false,error:'method_not_allowed'});
  try{
    if(!hasDatabase()) return res.status(200).json({ok:true,mode:'static-fallback',products:await staticCatalog()});
    const rows=await sql`select p.product_id,p.name,p.model,p.entity_type,p.description,p.problem_solved,p.status,p.editorial_status,p.currency,p.country_code,p.canonical_url,p.image_url,b.name brand,c.name category,coalesce((select json_agg(u.use_case order by u.priority) from rp_product_use_cases u where u.product_id=p.id),'[]'::json) use_cases,coalesce((select json_agg(json_build_object('fact',e.fact,'confidence',e.confidence,'verified',e.verified,'captured_at',e.captured_at,'source_url',s.source_url) order by e.captured_at desc) from rp_evidence e left join rp_sources s on s.id=e.source_id where e.product_id=p.id),'[]'::json) evidence from rp_products p left join rp_brands b on b.id=p.brand_id left join rp_categories c on c.id=p.category_id where coalesce(p.editorial_status,'')<>'ARCHIVED' order by p.updated_at desc,p.name asc limit 2500`;
    return res.status(200).json({ok:true,mode:'neon',products:rows});
  }catch(error){console.error(error);try{return res.status(200).json({ok:true,mode:'static-fallback',products:await staticCatalog()})}catch{return res.status(503).json({ok:false,error:'catalog_unavailable'})}}
}
