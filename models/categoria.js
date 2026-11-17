
const pool = require('../config/database');

// Lista somente as categorias do usuario autenticado
async function listarPorUsuario(usuarioId) {
  const [rows] = await pool.execute(
    `SELECT id, nome, tipo
     FROM categorias
     WHERE usuario_id = ?
     ORDER BY nome ASC`,
    [usuarioId]
  );

  return rows;
}

// Cadastra uma categoria para um usuario
async function criarCategoria(usuarioId, nome, tipo) {
  const [resultado] = await pool.execute(
    `INSERT INTO categorias (usuario_id, nome, tipo)
     VALUES (?, ?, ?)`,
    [usuarioId, nome, tipo]
  );

  return {
    id: resultado.insertId,
    usuario_id: usuarioId,
    nome,
    tipo
  };
}

module.exports = {
  listarPorUsuario,
  criarCategoria
};
