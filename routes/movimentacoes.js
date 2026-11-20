
const express = require('express');
const router = express.Router();

const autenticarToken = require('../middlewares/authMiddleware');
const movimentacaoController = require('../controllers/movimentacaoController');

router.use(autenticarToken);

router.get('/', movimentacaoController.listarMovimentacoes);
router.post('/', movimentacaoController.criarMovimentacao);

module.exports = router;
