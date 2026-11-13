const pool = require('../config/database');

// Busca um usuario pelo ID
async function buscarPorId(id) {
  const [rows] = await pool.execute(
    'SELECT id, nome, email, criado_em FROM usuarios WHERE id = ?',
    [id]
  );

  return rows[0] || null;
}

// Busca um usuario pelo email
async function buscarPorEmail(email) {
  const [rows] = await pool.execute(
    'SELECT * FROM usuarios WHERE email = ?',
    [email]
  );

  return rows[0] || null;
}

// Cadastra um novo usuario
async function criarUsuario(nome, email, senhaHash) {
  const [resultado] = await pool.execute(
    'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
    [nome, email, senhaHash]
  );

  return {
    id: resultado.insertId,
    nome,
    email
  };
}

// Lista os usuarios sem retornar senhas
async function listarUsuarios() {
  const [rows] = await pool.execute(
    'SELECT id, nome, email, criado_em FROM usuarios'
  );

  return rows;
}

module.exports = {
  buscarPorId,
  buscarPorEmail,
  criarUsuario,
  listarUsuarios
};