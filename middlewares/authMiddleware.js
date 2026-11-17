
const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      mensagem: 'Token nao fornecido'
    });
  }

  const partes = authorization.split(' ');

  if (
    partes.length !== 2 ||
    partes[0] !== 'Bearer' ||
    !partes[1]
  ) {
    return res.status(401).json({
      mensagem: 'Formato de token invalido'
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET nao configurado');

    return res.status(500).json({
      mensagem: 'Erro interno de configuracao'
    });
  }

  try {
    const dados = jwt.verify(
      partes[1],
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    if (
      !dados ||
      !Number.isInteger(dados.id) ||
      typeof dados.email !== 'string'
    ) {
      return res.status(401).json({
        mensagem: 'Token invalido'
      });
    }

    req.usuario = {
      id: dados.id,
      email: dados.email
    };

    next();

  } catch (erro) {
    return res.status(401).json({
      mensagem: 'Token invalido ou expirado'
    });
  }
}

module.exports = autenticarToken;
