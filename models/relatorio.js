const db = require('../config/database');

async function porCategorias(usuarioId, inicio, fim) {
  const [linhas] = await db.execute(`
    SELECT c.id AS categoriaId, c.nome AS categoria, c.tipo,
           COALESCE(SUM(l.valor), 0) AS total,
           COUNT(l.id) AS quantidade
    FROM categorias c
    LEFT JOIN lancamentos l ON l.categoria_id = c.id
      AND l.usuario_id = c.usuario_id AND l.data BETWEEN ? AND ?
    WHERE c.usuario_id = ?
    GROUP BY c.id, c.nome, c.tipo
    ORDER BY c.tipo, total DESC, c.nome
  `, [inicio, fim, usuarioId]);
  return linhas.map(r => ({ ...r, total: Number(r.total), quantidade: Number(r.quantidade) }));
}

async function porFontes(usuarioId, inicio, fim) {
  const [linhas] = await db.execute(`
    SELECT f.id AS fonteDestinoId, f.nome, f.tipo,
      COALESCE(SUM(CASE WHEN l.tipo = 'entrada' THEN l.valor ELSE 0 END), 0) AS entradas,
      COALESCE(SUM(CASE WHEN l.tipo = 'saida' THEN l.valor ELSE 0 END), 0) AS saidas,
      COUNT(l.id) AS quantidade
    FROM fontes_destinos f
    LEFT JOIN lancamentos l ON l.fonte_destino_id = f.id
      AND l.usuario_id = f.usuario_id AND l.data BETWEEN ? AND ?
    WHERE f.usuario_id = ?
    GROUP BY f.id, f.nome, f.tipo
    ORDER BY f.nome
  `, [inicio, fim, usuarioId]);
  return linhas.map(r => {
    const entradas = Number(r.entradas), saidas = Number(r.saidas);
    return { fonteDestinoId: r.fonteDestinoId, nome: r.nome, tipo: r.tipo,
      entradas, saidas, saldo: Math.round((entradas - saidas) * 100) / 100,
      quantidade: Number(r.quantidade) };
  });
}

module.exports = { porCategorias, porFontes };
