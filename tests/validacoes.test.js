
const test = require('node:test');
const assert = require('node:assert/strict');

const {
  validarEmail,
  validarSenha,
  validarNome,
  validarCadastro
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
    senha: '12345678'
  });

  assert.equal(resultado.valido, true);
  assert.deepEqual(resultado.erros, []);
});

test('deve rejeitar um cadastro invalido', () => {
  const resultado = validarCadastro({
    nome: 'J',
    email: 'invalido',
    senha: '123'
  });

  assert.equal(resultado.valido, false);
  assert.equal(resultado.erros.length, 3);
});

test('deve rejeitar dados ausentes', () => {
  const resultado = validarCadastro(null);

  assert.equal(resultado.valido, false);
  assert.ok(resultado.erros.length > 0);
});
