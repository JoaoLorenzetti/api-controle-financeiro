require('dotenv').config();
const express=require('express');const app=express();
app.use(express.json());
app.use('/',require('./routes'));
app.use('/api',require('./routes')); // compatibilidade temporaria com rotas anteriores
app.use((req,res)=>res.status(404).json({erro:'Rota nao encontrada.'}));
app.use((erro,req,res,next)=>{if(erro.name==='UnauthorizedError')return res.status(401).json({erro:'Token ausente, invalido ou expirado.'});console.error(erro);return res.status(500).json({erro:'Erro interno do servidor.'});});
if(require.main===module)app.listen(process.env.PORT||3000,()=>console.log('API rodando'));
module.exports=app;
