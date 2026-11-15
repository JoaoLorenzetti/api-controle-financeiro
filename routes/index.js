const express = require('express');
const router = express.Router();

const healthRoutes = require('./health');
const usuarioRoutes = require('./usuarios');

router.use('/health', healthRoutes);
router.use('/usuarios', usuarioRoutes);

module.exports = router;