
const categoriaModel = require('../models/categoria');
 
async function criarCategoria(req, res) {
  try {
    const { nome, tipo } = req.body || {};
 
    if (
      typeof nome !== 'string' ||
      nome.trim().length < 2 ||
      nome.trim().length > 100
    ) {
      return res.status(400).json({
        mensagem: 'Nome deve ter entre 2 e 100 caracteres'
      });
    }
 
    if (tipo !== 'receita' && tipo !== 'despesa') {
      return res.status(400).json({
        mensagem: 'Tipo deve ser receita ou despesa'
      });
    }
 
    const categoria = await categoriaModel.criarCategoria(
      req.usuario.id,
      nome.trim(),
      tipo
    );
 
    return res.status(201).json({
      mensagem: 'Categoria cadastrada com sucesso',
      categoria
    });
 
  } catch (erro) {
    console.error('Erro ao cadastrar categoria:', erro);
 
    return res.status(500).json({
      mensagem: 'Erro interno ao cadastrar categoria'
    });
  }
}
 
async function listarCategorias(req, res) {
  try {
    const categorias = await categoriaModel.listarPorUsuario(
      req.usuario.id
    );
 
    return res.status(200).json({
      categorias
    });
 
  } catch (erro) {
    console.error('Erro ao listar categorias:', erro);
 
    return res.status(500).json({
      mensagem: 'Erro interno ao listar categorias'
    });
  }
}
 
module.exports = {
  criarCategoria,
  listarCategorias
};
 