
const bcrypt = require('bcrypt');

const usuarioModel = require('../models/usuario');
const { validarCadastro } = require('../utils/validacoes');

async function cadastrarUsuario(req, res) {
  try {
    const validacao = validarCadastro(req.body);

    if (!validacao.valido) {
      return res.status(400).json({
        mensagem: 'Dados de cadastro invalidos',
        erros: validacao.erros
      });
    }

    const nome = req.body.nome.trim();
    const email = req.body.email.trim().toLowerCase();
    const senha = req.body.senha;

    const usuarioExistente =
      await usuarioModel.buscarPorEmail(email);

    if (usuarioExistente) {
      return res.status(409).json({
        mensagem: 'Este email ja esta cadastrado'
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await usuarioModel.criarUsuario(
      nome,
      email,
      senhaHash
    );

    return res.status(201).json({
      mensagem: 'Usuario cadastrado com sucesso',
      usuario: novoUsuario
    });

  } catch (erro) {
    console.error('Erro ao cadastrar usuario:', erro);

    if (erro.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        mensagem: 'Este email ja esta cadastrado'
      });
    }

    return res.status(500).json({
      mensagem: 'Erro interno ao cadastrar usuario'
    });
  }
}

module.exports = {
  cadastrarUsuario
};
