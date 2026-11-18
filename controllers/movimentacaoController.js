
const movimentacaoModel = require('../models/movimentacao');

async function criarMovimentacao(req, res) {
  try {
    const {
      categoria_id,
      descricao,
      valor,
      tipo,
      data_movimentacao
    } = req.body || {};

    if (
      !Number.isSafeInteger(categoria_id) ||
      categoria_id <= 0
    ) {
      return res.status(400).json({
        mensagem: 'Categoria invalida'
      });
    }

    if (
      typeof descricao !== 'string' ||
      descricao.trim().length < 2 ||
      descricao.trim().length > 255
    ) {
      return res.status(400).json({
        mensagem: 'Descricao deve ter entre 2 e 255 caracteres'
      });
    }

    const valorValido =
      typeof valor === 'number' &&
      Number.isFinite(valor) &&
      valor > 0 &&
      valor <= 9999999999.99 &&
      Math.abs(valor * 100 - Math.round(valor * 100)) < 0.000001;

    if (!valorValido) {
      return res.status(400).json({
        mensagem: 'Valor deve ser positivo e ter ate duas casas decimais'
      });
    }

    if (tipo !== 'receita' && tipo !== 'despesa') {
      return res.status(400).json({
        mensagem: 'Tipo deve ser receita ou despesa'
      });
    }

    if (
      typeof data_movimentacao !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(data_movimentacao)
    ) {
      return res.status(400).json({
        mensagem: 'Data deve estar no formato AAAA-MM-DD'
      });
    }

    const data = new Date(data_movimentacao + 'T00:00:00Z');

    if (
      Number.isNaN(data.getTime()) ||
      data.toISOString().slice(0, 10) !== data_movimentacao
    ) {
      return res.status(400).json({
        mensagem: 'Data invalida'
      });
    }

    const categoria = await movimentacaoModel.buscarCategoria(
      req.usuario.id,
      categoria_id
    );

    if (!categoria) {
      return res.status(404).json({
        mensagem: 'Categoria nao encontrada'
      });
    }

    if (categoria.tipo !== tipo) {
      return res.status(400).json({
        mensagem: 'Tipo da movimentacao diferente do tipo da categoria'
      });
    }

    const movimentacao = await movimentacaoModel.criarMovimentacao({
      usuarioId: req.usuario.id,
      categoriaId: categoria_id,
      descricao: descricao.trim(),
      valor: Math.round(valor * 100) / 100,
      tipo,
      dataMovimentacao: data_movimentacao
    });

    return res.status(201).json({
      mensagem: 'Movimentacao cadastrada com sucesso',
      movimentacao
    });

  } catch (erro) {
    console.error('Erro ao cadastrar movimentacao:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno ao cadastrar movimentacao'
    });
  }
}

async function listarMovimentacoes(req, res) {
  try {
    const movimentacoes =
      await movimentacaoModel.listarPorUsuario(req.usuario.id);

    return res.status(200).json({
      movimentacoes
    });

  } catch (erro) {
    console.error('Erro ao listar movimentacoes:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno ao listar movimentacoes'
    });
  }
}

module.exports = {
  criarMovimentacao,
  listarMovimentacoes
};
