const router=require('express').Router();const auth=require('../controllers/authController');const usuarios=require('../controllers/usuarioController');const proteger=require('../middlewares/authMiddleware');
router.post('/cadastro',usuarios.cadastrarUsuario);router.post('/login',auth.login);router.get('/me',proteger,auth.me);module.exports=router;
