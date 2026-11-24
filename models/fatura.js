const db = require('../config/database');
async function listarCartoes(uid) {
  const [rows] = await db.execute("SELECT id,nome,dia_fechamento,dia_vencimento,limite FROM fontes_destinos WHERE usuario_id=? AND tipo='cartao_credito' ORDER BY nome",[uid]);
  return rows;
}
async function buscarCartao(uid,id) {
  const [rows] = await db.execute("SELECT id,nome,dia_fechamento,dia_vencimento,limite FROM fontes_destinos WHERE usuario_id=? AND id=? AND tipo='cartao_credito'",[uid,id]);
  return rows[0]||null;
}
async function compras(uid,id,inicio,fim) {
  const [rows] = await db.execute(`SELECT l.id,l.descricao,l.valor,l.data,l.parcela_atual,l.total_parcelas,l.grupo_parcelamento,c.nome AS categoria
    FROM lancamentos l JOIN categorias c ON c.id=l.categoria_id AND c.usuario_id=l.usuario_id
    WHERE l.usuario_id=? AND l.fonte_destino_id=? AND l.tipo='saida' AND l.data BETWEEN ? AND ?
    ORDER BY l.data,l.id`,[uid,id,inicio,fim]);
  return rows;
}
module.exports={listarCartoes,buscarCartao,compras};
