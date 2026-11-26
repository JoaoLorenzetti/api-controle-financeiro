const relatorio = require('../models/relatorio');

function dataValida(valor) {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const d = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === valor;
}

function periodo(query) {
  const { inicio, fim } = query;
  if (!dataValida(inicio) || !dataValida(fim) || inicio > fim) return null;
  return { inicio, fim };
}

function periodoAnterior({ inicio, fim }) {
  const primeiro = new Date(`${inicio}T00:00:00Z`);
  const ultimo = new Date(`${fim}T00:00:00Z`);
  const dias = Math.round((ultimo - primeiro) / 86400000) + 1;
  const anteriorFim = new Date(primeiro.getTime() - 86400000);
  const anteriorInicio = new Date(primeiro.getTime() - dias * 86400000);
  return { inicio: anteriorInicio.toISOString().slice(0, 10), fim: anteriorFim.toISOString().slice(0, 10) };
}

function totais(linhas) {
  const centavos = tipo => linhas.filter(r => r.tipo === tipo)
    .reduce((s, r) => s + Math.round(r.total * 100), 0);
  const entradas = centavos('entrada'), saidas = centavos('saida');
  return { entradas: entradas / 100, saidas: saidas / 100, saldo: (entradas - saidas) / 100 };
}

async function categorias(req, res) {
  const p = periodo(req.query);
  if (!p) return res.status(400).json({ erro: 'Periodo invalido.' });
  try {
    const anterior = periodoAnterior(p);
    const [atual, passado] = await Promise.all([
      relatorio.porCategorias(req.auth.id, p.inicio, p.fim),
      relatorio.porCategorias(req.auth.id, anterior.inicio, anterior.fim)
    ]);
    const mapa = new Map(passado.map(r => [r.categoriaId, r.total]));
    const resumo = totais(atual);
    const arred = n => Math.round(n * 100) / 100;
    const categorias = atual.map(r => {
      const anterior = mapa.get(r.categoriaId) || 0;
      const base = r.tipo === 'entrada' ? resumo.entradas : resumo.saidas;
      return {...r, totalAnterior: anterior, anterior,
        percentual: base ? arred(r.total / base * 100) : 0,
        variacao: anterior ? arred((r.total - anterior) / anterior * 100) : (r.total ? null : 0),
        variacaoValor: arred(r.total - anterior)};
    });
    return res.json({periodo:p,resumo,periodoAnterior:anterior,resumoAnterior:totais(passado),categorias,
      entradas:{total:resumo.entradas,categorias:categorias.filter(r=>r.tipo==='entrada')},
      saidas:{total:resumo.saidas,categorias:categorias.filter(r=>r.tipo==='saida')}});
  } catch (e) { console.error(e); return res.status(500).json({ erro: 'Erro interno do servidor.' }); }
}

async function fontesDestinos(req, res) {
  const p = periodo(req.query);
  if (!p) return res.status(400).json({ erro: 'Periodo invalido.' });
  try {
    const fontes = await relatorio.porFontes(req.auth.id, p.inicio, p.fim);
    const soma = campo => Math.round(fontes.reduce((s, f) => s + Math.round(f[campo] * 100), 0)) / 100;
    const entradas = soma('entradas'), saidas = soma('saidas');
    return res.json({ periodo: p, resumo: { entradas, saidas,
      saldo: Math.round((entradas - saidas) * 100) / 100 }, fontesDestinos: fontes });
  } catch (e) { console.error(e); return res.status(500).json({ erro: 'Erro interno do servidor.' }); }
}

module.exports = { categorias, fontesDestinos };
