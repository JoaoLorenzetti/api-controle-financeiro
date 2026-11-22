const bcrypt=require('bcrypt');const jwt=require('jsonwebtoken');const usuarios=require('../models/usuario');
async function login(req,res){
 try{
  const {email,senha}=req.body||{};
  if(typeof email!=='string'||typeof senha!=='string'||!email.trim()||!senha)return res.status(400).json({erro:'Dados invalidos.',campos:{login:'Email e senha obrigatorios'}});
  const usuario=await usuarios.buscarPorEmail(email.trim().toLowerCase());
  if(!usuario||!(await bcrypt.compare(senha,usuario.senha_hash)))return res.status(401).json({erro:'Email ou senha invalidos.'});
  if(!process.env.JWT_SECRET)throw new Error('JWT_SECRET ausente');
  const token=jwt.sign({id:usuario.id,nome:usuario.nome,email:usuario.email},process.env.JWT_SECRET,{expiresIn:'1h',algorithm:'HS256'});
  return res.json({token,usuario:{id:usuario.id,nome:usuario.nome,email:usuario.email}});
 }catch(e){console.error(e);return res.status(500).json({erro:'Erro interno do servidor.'});}
}
async function me(req,res){try{const usuario=await usuarios.buscarPorId(req.auth.id);if(!usuario)return res.status(404).json({erro:'Usuario nao encontrado.'});return res.json(usuario);}catch(e){console.error(e);return res.status(500).json({erro:'Erro interno do servidor.'});}}
module.exports={login,me};
