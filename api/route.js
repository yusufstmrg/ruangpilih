import { sql, hasDatabase } from '../lib/neon.js';

const FALLBACK_ORDER=['Shopee','TikTok Shop','Tokopedia','Lazada','Blibli'];

async function fallbackProduct(req, productId){
  const host=req.headers?.host;
  const proto=req.headers?.['x-forwarded-proto']||'https';
  const base=host?`${proto}://${host}`:'';
  const r=await fetch(`${base}/data/products.json`,{headers:{accept:'application/json'}});
  if(!r.ok) throw new Error('catalog_unavailable');
  const data=await r.json();
  return (data.products||[]).find(p=>p.product_id===productId)||null;
}

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({ok:false,error:'method_not_allowed'});
  const productId=String(req.query?.product_id||'').trim();
  if(!productId) return res.status(400).json({ok:false,error:'product_id_required'});
  try{
    if(hasDatabase()){
      const rows=await sql()`
        select m.name as marketplace, m.routing_priority, l.source_url,
               l.status as listing_status, o.status as offer_status,
               a.destination_url, a.health_status
        from rp_listings l
        join rp_products p on p.id=l.product_id
        left join rp_sellers s on s.id=l.seller_id
        left join rp_marketplaces m on m.id=s.marketplace_id
        left join rp_affiliate_offers o on o.listing_id=l.id and o.status='VERIFIED_ACTIVE'
        left join rp_affiliate_links a on a.offer_id=o.id and a.health_status in ('HEALTHY','VERIFIED')
        where p.product_id=${productId} and l.status='VERIFIED'
        order by m.routing_priority asc
      `;
      const eligible=rows.filter(r=>r.destination_url||r.source_url);
      if(eligible.length){
        const preferred=eligible.find(r=>r.marketplace==='Shopee')||eligible[0];
        return res.status(200).json({ok:true,source:'neon',marketplace:preferred.marketplace,url:preferred.destination_url||preferred.source_url,verified:Boolean(preferred.destination_url&&preferred.offer_status==='VERIFIED_ACTIVE'),fallbacks:eligible.map(r=>r.marketplace)});
      }
    }
    const p=await fallbackProduct(req,productId);
    if(!p) return res.status(404).json({ok:false,error:'product_not_found'});
    return res.status(200).json({ok:true,source:'static-fallback',marketplace:'Shopee',url:p.affiliate?.route||p.affiliate?.publisher_page||'#',verified:false,fallbacks:FALLBACK_ORDER.slice(1)});
  }catch(error){
    console.error('route_error',error);
    return res.status(503).json({ok:false,error:'routing_unavailable'});
  }
}
