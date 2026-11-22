
const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validarEmail,
  validarSenha,
  validarNome,
  validarCadastro,
  validarCPF,
  normalizarCPF
} = require('../utils/validacoes');

test('deve aceitar um email valido', () => {
  assert.equal(validarEmail('joao@email.com'), true);
});

test('deve rejeitar um email invalido', () => {
  assert.equal(validarEmail('email-invalido'), false);
});

test('deve aceitar uma senha com 8 caracteres', () => {
  assert.equal(validarSenha('12345678'), true);
});

test('deve rejeitar uma senha curta', () => {
  assert.equal(validarSenha('123'), false);
});

test('deve aceitar um nome valido', () => {
  assert.equal(validarNome('Joao'), true);
});

test('deve rejeitar um nome muito curto', () => {
  assert.equal(validarNome('J'), false);
});

test('deve aceitar um cadastro valido', () => {
  const resultado = validarCadastro({
    nome: 'Joao',
    email: 'joao@email.com',
    senha: '12345678',
    cpf: '529.982.247-25'
  });

  assert.equal(resultado.valido, true);
  assert.deepEqual(resultado.erros, []);
});

test('deve rejeitar um cadastro invalido', () => {
  const resultado = validarCadastro({
    nome: 'J',
    email: 'invalido',
    senha: '123',
    cpf: '529.982.247-25'
  });

  assert.equal(resultado.valido, false);
  assert.equal(resultado.erros.length, 3);
});

test('deve rejeitar dados ausentes', () => {
  const resultado = validarCadastro(null);

  assert.equal(resultado.valido, false);
  assert.ok(resultado.erros.length > 0);
});


test('deve aceitar CPF valido', () => {
  assert.equal(validarCPF('529.982.247-25'), true);
});

test('deve rejeitar CPF com digitos repetidos', () => {
  assert.equal(validarCPF('111.111.111-11'), false);
});

test('deve rejeitar CPF com digito incorreto', () => {
  assert.equal(validarCPF('529.982.247-26'), false);
});

test('deve normalizar CPF', () => {
  assert.equal(
    normalizarCPF('529.982.247-25'),
    '52998224725'
  );
});

test('deve rejeitar cadastro sem CPF', () => {
  const resultado = validarCadastro({
    nome: 'Joao',
    email: 'joao@email.com',
    senha: '12345678'
  });

  assert.equal(resultado.valido, false);
  assert.ok(resultado.erros.includes('CPF invalido'));
});

