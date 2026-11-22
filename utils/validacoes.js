function validarEmail(x){return typeof x==='string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);}
function validarSenha(x){return typeof x==='string' && x.length>=8 && /[A-Za-z]/.test(x) && /\d/.test(x);}
function validarNome(x){return typeof x==='string' && x.trim().length>=2;}
function normalizarCPF(x){return typeof x==='string'?x.replace(/\D/g,''):'';}
function validarCPF(x){
 if(typeof x!=='string'|| !/^[\d.\-\s]+$/.test(x))return false;
 const d=normalizarCPF(x);
 if(!/^\d{11}$/.test(d)||/^(\d)\1{10}$/.test(d))return false;
 const digito=n=>{let soma=0;for(let i=0;i<n;i++)soma+=Number(d[i])*(n+1-i);const r=soma*10%11;return r===10?0:r;};
 return digito(9)===Number(d[9])&&digito(10)===Number(d[10]);
}
function validarCadastro(d){
 if(!d||typeof d!=='object'||Array.isArray(d))return {valido:false,erros:['Dados de cadastro invalidos']};
 const erros=[];
 if(!validarNome(d.nome))erros.push('Nome deve possuir pelo menos 2 caracteres');
 if(!validarEmail(d.email))erros.push('Email invalido');
 if(!validarSenha(d.senha))erros.push('Senha deve possuir 8 caracteres, letras e numeros');
 if(!validarCPF(d.cpf))erros.push('CPF invalido');
 return {valido:erros.length===0,erros};
}
module.exports={validarEmail,validarSenha,validarNome,validarCadastro,normalizarCPF,validarCPF};
