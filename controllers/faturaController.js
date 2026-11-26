const model=require('../models/fatura');
const {dataISO,deslocar,datas,parcela,ciclo}=require('../utils/fatura');
const centavos=x=>Math.round(Number(x)*100);
function hojeISO(){const d=new Date();return dataISO(d.getFullYear(),d.getMonth()+1,d.getDate());}
function parametros(req){const mes=req.query.mes;const n=req.query.meses===undefined?3:Number(req.query.meses);if(mes!==undefined&&(typeof mes!=='string'||!/^\d{4}-(0[1-9]|1[0-2])$/.test(mes)||Number(mes.slice(0,4))<1000)||!Number.isInteger(n)||n<1||n>12)return null;return {mes,n};}
async function montar(uid,c,p,n){
 const hoje=hojeISO(),base=p.mes||hoje.slice(0,7);let [ano,mes]=base.split('-').map(Number);
 if(!p.mes&&hoje>=dataISO(ano,mes,c.dia_fechamento))({ano,mes}=deslocar(ano,mes,1));
 const itens=(await model.compras(uid,c.id)).map(x=>({...x,valor:Number(x.valor),parcela:`${x.parcela_atual}/${x.total_parcelas}`,...parcela(x.data,x.parcela_atual,c)}));
 const usado=itens.filter(x=>x.vencimento>=hoje).reduce((s,x)=>s+centavos(x.valor),0);
 const faturas=Array.from({length:n},(_,i)=>{const m=deslocar(ano,mes,i),d=datas(m.ano,m.mes,c),lista=itens.filter(x=>x.fechamento===d.fechamento);return {...d,mes:d.fechamento.slice(0,7),periodo:ciclo(m.ano,m.mes,c.dia_fechamento),total:lista.reduce((s,x)=>s+centavos(x.valor),0)/100,itens:lista};});
 return {cartao:{id:c.id,nome:c.nome,limite:Number(c.limite),limiteTotal:Number(c.limite),limiteUtilizado:usado/100,limiteDisponivel:(centavos(c.limite)-usado)/100},faturas};
}
function erro(res,e){console.error(e);return res.status(500).json({erro:'Erro interno do servidor.'});}
async function listar(req,res){try{return res.json({cartoes:await model.listarCartoes(req.auth.id)});}catch(e){return erro(res,e);}}
async function todas(req,res){const p=parametros(req);if(!p)return res.status(400).json({erro:'Periodo invalido.'});try{const cs=await model.listarCartoes(req.auth.id);return res.json({cartoes:await Promise.all(cs.map(c=>montar(req.auth.id,c,p,p.n+1)))});}catch(e){return erro(res,e);}}
async function gerar(req,res,projecao){const p=parametros(req),id=Number(req.params.id);if(!p||!Number.isSafeInteger(id)||id<1)return res.status(400).json({erro:'Parametros invalidos.'});try{const c=await model.buscarCartao(req.auth.id,id);if(!c)return res.status(404).json({erro:'Cartao nao encontrado.'});return res.json(await montar(req.auth.id,c,p,projecao?p.n:1));}catch(e){return erro(res,e);}}
module.exports={listar,todas,fatura:(req,res)=>gerar(req,res,false),projecao:(req,res)=>gerar(req,res,true)};
