const db = require('../config/database');
async function listarPorUsuario(uid, tipo) { let sql = 'SELECT id,nome,tipo FROM categorias WHERE usuario_id=?', args = [uid]; if (tipo) { sql += ' AND tipo=?'; args.push(tipo); } sql += ' ORDER BY nome'; const [r] = await db.execute(sql, args); return r; }
async function buscar(uid, id) { const [r] = await db.execute('SELECT id,nome,tipo FROM categorias WHERE id=? AND usuario_id=?', [id, uid]); return r[0] || null; }
async function criar(uid, nome, tipo) { const [r] = await db.execute('INSERT INTO categorias(usuario_id,nome,tipo) VALUES(?,?,?)', [uid, nome, tipo]); return { id: r.insertId, nome, tipo }; }
async function atualizar(uid, id, nome, tipo) { const [r] = await db.execute('UPDATE categorias SET nome=?,tipo=? WHERE id=? AND usuario_id=?', [nome, tipo, id, uid]); return r.affectedRows; }
async function excluir(uid, id) { const [r] = await db.execute('DELETE FROM categorias WHERE id=? AND usuario_id=?', [id, uid]); return r.affectedRows; }
module.exports = { listarPorUsuario, buscar, criar, atualizar, excluir };
