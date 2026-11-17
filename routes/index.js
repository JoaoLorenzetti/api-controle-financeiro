const express = require('express');
const router = express.Router();

const healthRoutes = require('./health');
const usuarioRoutes = require('./usuarios');
const authRoutes = require('./auth');

router.use('/health', healthRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/auth', authRoutes);

module.exports = router;