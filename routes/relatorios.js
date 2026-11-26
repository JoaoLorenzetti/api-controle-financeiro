const router = require('express').Router();
const autenticar = require('../middlewares/authMiddleware');
const controller = require('../controllers/relatorioController');
router.use(autenticar);
router.get('/categorias', controller.categorias);
router.get('/fontes-destinos', controller.fontesDestinos);
router.get('/faturas', require('../controllers/faturaController').todas);
module.exports = router;
