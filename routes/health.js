const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    mensagem: 'API de Controle Financeiro funcionando'
  });
});

module.exports = router;
