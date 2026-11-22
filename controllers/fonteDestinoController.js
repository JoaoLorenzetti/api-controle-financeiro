const m = require('../models/fonteDestino');
const idOk = x => /^\d+$/.test(String(x)) && Number(x) > 0;
function validar(d) {
    const campos = {}; if (!d || typeof d.nome !== 'string' || d.nome.trim().length < 2 || d.nome.trim().length > 60) campos.nome = 'Nome invalido.';
    if (!['renda', 'conta', 'cartao_credito'].includes(d?.tipo)) campos.tipo = 'Tipo invalido.';
    if (d?.tipo === 'cartao_credito') {
        if (!Number.isInteger(d.dia_fechamento) || d.dia_fechamento < 1 || d.dia_fechamento > 31) campos.dia_fechamento = 'Dia invalido.';
        if (!Number.isInteger(d.dia_vencimento) || d.dia_vencimento < 1 || d.dia_vencimento > 31) campos.dia_vencimento = 'Dia invalido.';
        if (typeof d.limite !== 'number' || !Number.isFinite(d.limite) || d.limite <= 0) campos.limite = 'Limite invalido.';
    }
    return { campos, dados: { nome: typeof d?.nome === 'string' ? d.nome.trim() : '', tipo: d?.tipo, dia_fechamento: d?.tipo === 'cartao_credito' ? d.dia_fechamento : null, dia_vencimento: d?.tipo === 'cartao_credito' ? d.dia_vencimento : null, limite: d?.tipo === 'cartao_credito' ? d.limite : null } };
}
function erro(res, e) { if (e.code === 'ER_DUP_ENTRY') return res.status(409).json({ erro: 'Fonte/destino duplicado.' }); if (e.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).json({ erro: 'Fonte/destino possui lancamentos vinculados.' }); console.error(e); return res.status(500).json({ erro: 'Erro interno do servidor.' }); }
async function listar(req, res) { try { return res.json({ fontesDestinos: await m.listar(req.auth.id) }); } catch (e) { return erro(res, e); } }
async function criar(req, res) { const v = validar(req.body); if (Object.keys(v.campos).length) return res.status(400).json({ erro: 'Dados invalidos.', campos: v.campos }); try { return res.status(201).json(await m.criar(req.auth.id, v.dados)); } catch (e) { return erro(res, e); } }
async function atualizar(req, res) { if (!idOk(req.params.id)) return res.status(400).json({ erro: 'ID invalido.' }); const v = validar(req.body); if (Object.keys(v.campos).length) return res.status(400).json({ erro: 'Dados invalidos.', campos: v.campos }); try { const uid = req.auth.id, id = Number(req.params.id); if (!await m.buscar(uid, id)) return res.status(404).json({ erro: 'Fonte/destino nao encontrado.' }); await m.atualizar(uid, id, v.dados); return res.json(await m.buscar(uid, id)); } catch (e) { return erro(res, e); } }
async function excluir(req, res) { if (!idOk(req.params.id)) return res.status(400).json({ erro: 'ID invalido.' }); try { const n = await m.excluir(req.auth.id, Number(req.params.id)); return n ? res.status(204).end() : res.status(404).json({ erro: 'Fonte/destino nao encontrado.' }); } catch (e) { return erro(res, e); } }
module.exports = { listar, criar, atualizar, excluir };
