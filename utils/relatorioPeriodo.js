function periodoAnterior({inicio,fim}) {
 const a=new Date(`${inicio}T00:00:00Z`),b=new Date(`${fim}T00:00:00Z`);
 if(Number.isNaN(a.getTime())||Number.isNaN(b.getTime())||a>b)throw new Error('Periodo invalido');
 const dias=Math.round((b-a)/86400000)+1;
 return {inicio:new Date(a.getTime()-dias*86400000).toISOString().slice(0,10),fim:new Date(a.getTime()-86400000).toISOString().slice(0,10)};
}
module.exports={periodoAnterior};
