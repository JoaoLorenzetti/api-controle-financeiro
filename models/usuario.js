const pool=require('../config/database');
const categorias=[['Salário','entrada'],['Outras entradas','entrada'],['Alimentação','saida'],['Moradia','saida'],['Saúde','saida'],['Mobilidade','saida'],['Lazer','saida'],['Educação','saida'],['Outras saídas','saida']];
async function buscarPorId(id){const [r]=await pool.execute('SELECT id,nome,email,criado_em FROM usuarios WHERE id=?',[id]);return r[0]||null;}
async function buscarPorEmail(email){const [r]=await pool.execute('SELECT * FROM usuarios WHERE email=?',[email]);return r[0]||null;}
async function criarUsuario(nome,email,senhaHash,cpf){
 const conn=await pool.getConnection();
 try{
  await conn.beginTransaction();
  const [r]=await conn.execute('INSERT INTO usuarios(nome,email,senha_hash,cpf) VALUES(?,?,?,?)',[nome,email,senhaHash,cpf]);
  for(const [cat,tipo] of categorias)await conn.execute('INSERT INTO categorias(usuario_id,nome,tipo) VALUES(?,?,?)',[r.insertId,cat,tipo]);
  await conn.execute("INSERT INTO fontes_destinos(usuario_id,nome,tipo) VALUES(?,'Conta corrente','conta')",[r.insertId]);
  await conn.commit();return {id:r.insertId,nome,email};
 }catch(e){await conn.rollback();throw e;}finally{conn.release();}
}
async function listarUsuarios(){const [r]=await pool.execute('SELECT id,nome,email,criado_em FROM usuarios');return r;}
module.exports={buscarPorId,buscarPorEmail,criarUsuario,listarUsuarios};
