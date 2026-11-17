
const express = require('express');
const router = express.Router();

const autenticarToken = require('../middlewares/authMiddleware');

const categoriaController = require(
  '../controllers/categoriaController'
);

// Todas as rotas de categorias exigem autenticacao
router.use(autenticarToken);

router.post('/', categoriaController.criarCategoria);
router.get('/', categoriaController.listarCategorias);

module.exports = router;
