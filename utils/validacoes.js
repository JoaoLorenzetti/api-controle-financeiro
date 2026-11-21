
// Verifica se um email possui formato valido
function validarEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return regex.test(email);
}

// Verifica se a senha possui pelo menos 8 caracteres
function validarSenha(senha) {
  return typeof senha === 'string' &&
    senha.length >= 8;
}

// Verifica se o nome foi preenchido
function validarNome(nome) {
  return typeof nome === 'string' &&
    nome.trim().length >= 2;
}

function normalizarCPF(cpf) {
  if (typeof cpf !== 'string') {
    return '';
  }

  return cpf.replace(/\D/g, '');
}

function validarCPF(cpf) {
  if (typeof cpf !== 'string' ||
      !/^[\d.\-\s]+$/.test(cpf)) {
    return false;
  }

  const numeros = normalizarCPF(cpf);

  if (!/^\d{11}$/.test(numeros)) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(numeros)) {
    return false;
  }

  function calcularDigito(tamanho) {
    let soma = 0;

    for (let i = 0; i < tamanho; i++) {
      soma += Number(numeros[i]) * (tamanho + 1 - i);
    }

    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  }

  return (
    calcularDigito(9) === Number(numeros[9]) &&
    calcularDigito(10) === Number(numeros[10])
  );
}

// Valida os dados de cadastro de um usuario
function validarCadastro(dados) {
  const erros = [];

  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) {
    return {
      valido: false,
      erros: ['Dados de cadastro invalidos']
    };
  }

  if (!validarNome(dados.nome)) {
    erros.push('Nome deve possuir pelo menos 2 caracteres');
  }

  if (!validarEmail(dados.email)) {
    erros.push('Email invalido');
  }

  if (!validarSenha(dados.senha)) {
    erros.push('Senha deve possuir pelo menos 8 caracteres');
  }

  return {
    valido: erros.length === 0,
    erros
  };
}

module.exports = {
  validarEmail,
  validarSenha,
  validarNome,
  validarCadastro,
  normalizarCPF,
  validarCPF
};
