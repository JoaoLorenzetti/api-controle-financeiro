const bcrypt=require('bcrypt');
const usuarioModel=require('../models/usuario');
const {validarCadastro,normalizarCPF}=require('../utils/validacoes');
async function cadastrarUsuario(req,res){
 try{
  const v=validarCadastro(req.body);
  if(!v.valido)return res.status(400).json({erro:'Dados invalidos.',campos:{cadastro:v.erros.join('; ')}});
  const {nome,senha}=req.body,email=req.body.email.trim().toLowerCase(),cpf=normalizarCPF(req.body.cpf);
  const hash=await bcrypt.hash(senha,10);
  const usuario=await usuarioModel.criarUsuario(nome.trim(),email,hash,cpf);
  return res.status(201).json(usuario);
 }catch(e){
  if(e.code==='ER_DUP_ENTRY'){
   const campo=String(e.sqlMessage||e.message).includes('cpf')?'cpf':'email';
   return res.status(409).json({erro:'Usuario ja cadastrado.',campos:{[campo]:`Este ${campo} ja esta cadastrado.`}});
  }
  console.error(e);return res.status(500).json({erro:'Erro interno do servidor.'});
 }
}
module.exports={cadastrarUsuario};
