const db = require('../config/database');
const col = 'id,nome,tipo,dia_fechamento,dia_vencimento,limite';
async function listar(uid) { const [r] = await db.execute(`SELECT ${col} FROM fontes_destinos WHERE usuario_id=? ORDER BY nome`, [uid]); return r; }
async function buscar(uid, id) { const [r] = await db.execute(`SELECT ${col} FROM fontes_destinos WHERE id=? AND usuario_id=?`, [id, uid]); return r[0] || null; }
async function criar(uid, d) { const [r] = await db.execute('INSERT INTO fontes_destinos(usuario_id,nome,tipo,dia_fechamento,dia_vencimento,limite) VALUES(?,?,?,?,?,?)', [uid, d.nome, d.tipo, d.dia_fechamento, d.dia_vencimento, d.limite]); return buscar(uid, r.insertId); }
async function atualizar(uid, id, d) { const [r] = await db.execute('UPDATE fontes_destinos SET nome=?,tipo=?,dia_fechamento=?,dia_vencimento=?,limite=? WHERE id=? AND usuario_id=?', [d.nome, d.tipo, d.dia_fechamento, d.dia_vencimento, d.limite, id, uid]); return r.affectedRows; }
async function excluir(uid, id) { const [r] = await db.execute('DELETE FROM fontes_destinos WHERE id=? AND usuario_id=?', [id, uid]); return r.affectedRows; }
module.exports = { listar, buscar, criar, atualizar, excluir };
