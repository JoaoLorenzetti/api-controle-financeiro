
const pool = require('../config/database');
 
// Busca uma categoria pertencente ao usuario
async function buscarCategoria(usuarioId, categoriaId) {
  const [rows] = await pool.execute(
    `SELECT id, tipo
     FROM categorias
     WHERE id = ? AND usuario_id = ?`,
    [categoriaId, usuarioId]
  );
 
  return rows[0] || null;
}
 
// Cadastra uma movimentacao financeira
async function criarMovimentacao(dados) {
  const {
    usuarioId,
    categoriaId,
    descricao,
    valor,
    tipo,
    dataMovimentacao
  } = dados;
 
  const [resultado] = await pool.execute(
    `INSERT INTO movimentacoes
     (usuario_id, categoria_id, descricao,
      valor, tipo, data_movimentacao)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      usuarioId,
      categoriaId,
      descricao,
      valor,
      tipo,
      dataMovimentacao
    ]
  );
 
  return {
    id: resultado.insertId,
    usuario_id: usuarioId,
    categoria_id: categoriaId,
    descricao,
    valor,
    tipo,
    data_movimentacao: dataMovimentacao
  };
}
 
// Lista movimentacoes do usuario
async function listarPorUsuario(usuarioId) {
  const [rows] = await pool.execute(
    `SELECT
       m.id,
       m.descricao,
       m.valor,
       m.tipo,
       m.data_movimentacao,
       c.nome AS categoria
     FROM movimentacoes m
     INNER JOIN categorias c
       ON m.categoria_id = c.id
       AND c.usuario_id = m.usuario_id
     WHERE m.usuario_id = ?
     ORDER BY m.data_movimentacao DESC, m.id DESC`,
    [usuarioId]
  );
 
  return rows;
}
 
module.exports = {
  buscarCategoria,
  criarMovimentacao,
  listarPorUsuario
};
 