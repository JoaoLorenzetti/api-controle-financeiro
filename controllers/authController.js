
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usuarioModel = require('../models/usuario');

async function login(req, res) {
  try {
    const { email, senha } = req.body || {};

    if (
      typeof email !== 'string' ||
      typeof senha !== 'string' ||
      !email.trim() ||
      !senha
    ) {
      return res.status(400).json({
        mensagem: 'Email e senha sao obrigatorios'
      });
    }

    const emailNormalizado = email.trim().toLowerCase();

    const usuario = await usuarioModel.buscarPorEmail(
      emailNormalizado
    );

    if (!usuario) {
      return res.status(401).json({
        mensagem: 'Credenciais invalidas'
      });
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha_hash
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        mensagem: 'Credenciais invalidas'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET nao configurado');

      return res.status(500).json({
        mensagem: 'Erro interno de configuracao'
      });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h', algorithm: 'HS256' }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (erro) {
    console.error('Erro ao realizar login:', erro);

    return res.status(500).json({
      mensagem: 'Erro interno ao realizar login'
    });
  }
}

module.exports = { login };
