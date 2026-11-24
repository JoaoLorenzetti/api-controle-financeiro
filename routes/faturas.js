const router=require('express').Router();
const auth=require('../middlewares/authMiddleware');
const c=require('../controllers/faturaController');
router.use(auth);
router.get('/cartoes',c.listar);
router.get('/cartoes/:id',c.fatura);
router.get('/cartoes/:id/projecao',c.projecao);
module.exports=router;
