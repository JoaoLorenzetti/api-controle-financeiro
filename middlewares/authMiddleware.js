const {expressjwt}=require('express-jwt');
const jwtMiddleware=expressjwt({secret:()=>{if(!process.env.JWT_SECRET)throw new Error('JWT_SECRET ausente');return process.env.JWT_SECRET;},algorithms:['HS256']});
module.exports=function autenticarToken(req,res,next){jwtMiddleware(req,res,erro=>{if(erro)return next(erro);if(!Number.isInteger(req.auth?.id))return res.status(401).json({erro:'Token invalido.'});req.usuario={id:req.auth.id,email:req.auth.email};next();});};
