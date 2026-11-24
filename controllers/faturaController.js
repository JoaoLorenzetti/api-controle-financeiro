const model=require('../models/fatura');
const {ciclo,dataISO,proximoMes}=require('../utils/fatura');
const idValido=x=>/^\d+$/.test(String(x))&&Number.isSafeInteger(Number(x))&&Number(x)>0;
const mesValido=x=>typeof x==='string'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(x)&&Number(x.slice(0,4))>=1000;
function parametros(req) {
 const agora=new Date();const mes=req.query.mes||`${agora.getFullYear()}-${String(agora.getMonth()+1).padStart(2,'0')}`;
 if(!mesValido(mes))return null;
 const quantidade=req.query.meses===undefined?3:Number(req.query.meses);
 if(!Number.isSafeInteger(quantidade)||quantidade<1||quantidade>12)return null;
 return {ano:Number(mes.slice(0,4)),mes:Number(mes.slice(5)),quantidade};
}
function erro(res,e){console.error(e);return res.status(500).json({erro:'Erro interno do servidor.'});}
async function listar(req,res){try{return res.json({cartoes:await model.listarCartoes(req.auth.id)});}catch(e){return erro(res,e);}}
async function gerar(req,res,projecao=false){
 if(!idValido(req.params.id))return res.status(400).json({erro:'Cartao invalido.'});
 const p=parametros(req);if(!p)return res.status(400).json({erro:'Mes ou quantidade de meses invalida.'});
 try{
  const cartao=await model.buscarCartao(req.auth.id,Number(req.params.id));
  if(!cartao)return res.status(404).json({erro:'Cartao nao encontrado.'});
  const n=projecao?p.quantidade:1;const faturas=[];
  let {ano,mes}=p;
  for(let i=0;i<n;i++){
   const periodo=ciclo(ano,mes,cartao.dia_fechamento);
   const itens=await model.compras(req.auth.id,cartao.id,periodo.inicio,periodo.fim);
   const centavos=itens.reduce((s,x)=>s+Math.round(Number(x.valor)*100),0);
   const venc=proximoMes(ano,mes);
   faturas.push({mes:`${ano}-${String(mes).padStart(2,'0')}`,periodo,
     vencimento:dataISO(venc.ano,venc.mes,cartao.dia_vencimento),total:centavos/100,
     itens:itens.map(x=>({...x,valor:Number(x.valor)}))});
   ({ano,mes}=proximoMes(ano,mes));
  }
  return res.json({cartao:{id:cartao.id,nome:cartao.nome,limite:Number(cartao.limite)},
    aviso:'Projecao baseada somente nos lancamentos ja registrados; nao representa compras futuras.',faturas});
 }catch(e){return erro(res,e);}
}
module.exports={listar,fatura:(req,res)=>gerar(req,res,false),projecao:(req,res)=>gerar(req,res,true)};
