function dataISO(ano,mes,dia) { // mes: 1..12
  const max=new Date(Date.UTC(ano,mes,0)).getUTCDate();
  return `${ano}-${String(mes).padStart(2,'0')}-${String(Math.min(dia,max)).padStart(2,'0')}`;
}
function ciclo(ano,mes,diaFechamento) {
  // Fatura identificada pelo mes de fechamento; inclui compras APOS fechamento anterior ate fechamento atual.
  const fim=dataISO(ano,mes,diaFechamento);
  const anterior=new Date(Date.UTC(ano,mes-2,1));
  const fechamentoAnterior=dataISO(anterior.getUTCFullYear(),anterior.getUTCMonth()+1,diaFechamento);
  const inicio=new Date(`${fechamentoAnterior}T00:00:00Z`);
  inicio.setUTCDate(inicio.getUTCDate()+1);
  return {inicio:inicio.toISOString().slice(0,10),fim};
}
function proximoMes(ano,mes) {
  const d=new Date(Date.UTC(ano,mes,1));return {ano:d.getUTCFullYear(),mes:d.getUTCMonth()+1};
}
module.exports={dataISO,ciclo,proximoMes};
