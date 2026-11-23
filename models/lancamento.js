const db=require('../config/database');
const base=`SELECT l.id,l.tipo,l.descricao,l.valor,l.data,l.categoria_id,l.fonte_destino_id,l.parcela_atual,l.total_parcelas,l.grupo_parcelamento,c.nome AS categoria_nome,f.nome AS fonte_destino_nome FROM lancamentos l JOIN categorias c ON c.id=l.categoria_id JOIN fontes_destinos f ON f.id=l.fonte_destino_id`;
async function categoria(uid,id){const [r]=await db.execute('SELECT id,tipo FROM categorias WHERE id=? AND usuario_id=?',[id,uid]);return r[0]||null;}
async function fonte(uid,id){const [r]=await db.execute('SELECT id,tipo FROM fontes_destinos WHERE id=? AND usuario_id=?',[id,uid]);return r[0]||null;}
async function buscar(uid,id){const [r]=await db.execute(`${base} WHERE l.id=? AND l.usuario_id=?`,[id,uid]);return r[0]||null;}
async function listar(uid,f){
 let where=' WHERE l.usuario_id=? AND l.data BETWEEN ? AND ?',args=[uid,f.inicio,f.fim];
 if(f.tipo){where+=' AND l.tipo=?';args.push(f.tipo);}if(f.categoriaId){where+=' AND l.categoria_id=?';args.push(f.categoriaId);}if(f.fonteDestinoId){where+=' AND l.fonte_destino_id=?';args.push(f.fonteDestinoId);}
 const [soma]=await db.execute(`SELECT l.tipo,SUM(l.valor) total FROM lancamentos l${where} GROUP BY l.tipo`,args);
 const [total]=await db.execute(`SELECT COUNT(*) quantidade FROM lancamentos l${where}`,args);
 const [itens]=await db.query(`${base}${where} ORDER BY l.data DESC,l.id DESC LIMIT 20 OFFSET ?`,[...args,(f.pagina-1)*20]);
 const entradas=Number(soma.find(x=>x.tipo==='entrada')?.total||0),saidas=Number(soma.find(x=>x.tipo==='saida')?.total||0);
 return {periodo:{inicio:f.inicio,fim:f.fim},resumo:{entradas,saidas,saldo:Math.round((entradas-saidas)*100)/100},pagina:f.pagina,totalPaginas:Math.ceil(total[0].quantidade/20),itens};
}
async function criar(uid,d,valores){const conn=await db.getConnection();try{await conn.beginTransaction();const ids=[];for(let i=0;i<valores.length;i++){const [r]=await conn.execute('INSERT INTO lancamentos(usuario_id,tipo,descricao,valor,data,categoria_id,fonte_destino_id,parcela_atual,total_parcelas,grupo_parcelamento) VALUES(?,?,?,?,?,?,?,?,?,?)',[uid,d.tipo,d.descricao,valores[i],d.data,d.categoriaId,d.fonteDestinoId,i+1,valores.length,d.grupo]);ids.push(r.insertId);}await conn.commit();return ids;}catch(e){await conn.rollback();throw e;}finally{conn.release();}}
async function atualizar(uid,id,d){const [r]=await db.execute('UPDATE lancamentos SET tipo=?,descricao=?,valor=?,data=?,categoria_id=?,fonte_destino_id=? WHERE id=? AND usuario_id=?',[d.tipo,d.descricao,d.valor,d.data,d.categoriaId,d.fonteDestinoId,id,uid]);return r.affectedRows;}
async function excluir(uid,id,todas){const conn=await db.getConnection();try{await conn.beginTransaction();const [rows]=await conn.execute('SELECT grupo_parcelamento FROM lancamentos WHERE id=? AND usuario_id=?',[id,uid]);if(!rows.length){await conn.rollback();return 0;}let r;if(todas&&rows[0].grupo_parcelamento){[r]=await conn.execute('DELETE FROM lancamentos WHERE grupo_parcelamento=? AND usuario_id=?',[rows[0].grupo_parcelamento,uid]);}else{[r]=await conn.execute('DELETE FROM lancamentos WHERE id=? AND usuario_id=?',[id,uid]);}await conn.commit();return r.affectedRows;}catch(e){await conn.rollback();throw e;}finally{conn.release();}}
module.exports={categoria,fonte,buscar,listar,criar,atualizar,excluir};
