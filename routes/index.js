const router=require('express').Router();
router.use('/health',require('./health'));
router.use('/auth',require('./auth'));
router.use('/usuarios',require('./usuarios'));
router.use('/categorias',require('./categorias'));
// Fontes e lancamentos serao registrados nos commits seguintes.
module.exports=router;
