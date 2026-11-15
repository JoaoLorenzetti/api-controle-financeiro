const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuarioController');

// Cadastro de novos usuarios
router.post('/', usuarioController.cadastrarUsuario);

module.exports = router;