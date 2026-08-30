import { sql, hasDatabase } from '../lib/neon.js';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ok:false,error:'method_not_allowed'});
  let body=req.body;
  try{if(typeof body==='string')body=JSON.parse(body)}catch{return res.status(400).json({ok:false,error:'invalid_json'})}
  if(!body?.event_name)return res.status(400).json({ok:false,error:'missing_event_name'});
  const metadata=body.metadata&&typeof body.metadata==='object'?body.metadata:{};
  const event={
    event_name:String(body.event_name).slice(0,120),
    session_id:body.session_id?String(body.session_id).slice(0,160):null,
    product_id:body.product_id?String(body.product_id).slice(0,160):(metadata.product_id?String(metadata.product_id).slice(0,160):null),
    metadata,
    occurred_at:new Date().toISOString()
  };
  if(!hasDatabase()){
    console.log(JSON.stringify({type:'ruangpilih_event',...event}));
    return res.status(202).json({ok:true,persisted:false,mode:'runtime_log_fallback'});
  }
  try{
    await sql()`insert into rp_events(event_name,session_id,product_id,metadata,occurred_at) values (${event.event_name},${event.session_id},${event.product_id},${JSON.stringify(event.metadata)},${event.occurred_at})`;
    return res.status(202).json({ok:true,persisted:true,mode:'neon'});
  }catch(error){
    console.error('event_persist_error',error);
    console.log(JSON.stringify({type:'ruangpilih_event_fallback',...event}));
    return res.status(202).json({ok:true,persisted:false,mode:'runtime_log_fallback'});
  }
}
