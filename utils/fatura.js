function dataISO(ano,mes,dia){const max=new Date(Date.UTC(ano,mes,0)).getUTCDate();return `${ano}-${String(mes).padStart(2,'0')}-${String(Math.min(dia,max)).padStart(2,'0')}`;}
function deslocar(ano,mes,n){const d=new Date(Date.UTC(ano,mes-1+n,1));return {ano:d.getUTCFullYear(),mes:d.getUTCMonth()+1};}
function proximoMes(ano,mes){return deslocar(ano,mes,1);}
function ciclo(ano,mes,dia){const a=deslocar(ano,mes,-1);const d=new Date(dataISO(ano,mes,dia)+'T00:00:00Z');d.setUTCDate(d.getUTCDate()-1);return {inicio:dataISO(a.ano,a.mes,dia),fim:d.toISOString().slice(0,10)};}
function datas(ano,mes,c){const fechamento=dataISO(ano,mes,c.dia_fechamento);const v=deslocar(ano,mes,c.dia_vencimento>c.dia_fechamento?0:1);const vencimento=dataISO(v.ano,v.mes,c.dia_vencimento);return {fechamento,vencimento,referencia:vencimento.slice(0,7)};}
function parcela(data,k,c){const [ano,mes]=data.split('-').map(Number);const p=deslocar(ano,mes,(data>=dataISO(ano,mes,c.dia_fechamento)?1:0)+Number(k)-1);return datas(p.ano,p.mes,c);}
module.exports={dataISO,ciclo,proximoMes,deslocar,datas,parcela};
