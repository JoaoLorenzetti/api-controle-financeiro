
const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');

const rotas = require('../routes/movimentacoes');

async function iniciarServidor() {
  const app = express();
  app.use(express.json());
  app.use('/api/movimentacoes', rotas);

  const servidor = app.listen(0);
  await new Promise(resolve => servidor.once('listening', resolve));

  const porta = servidor.address().port;
  return {
    servidor,
    url: `http://127.0.0.1:${porta}/api/movimentacoes`
  };
}

test('GET sem token retorna 401', async () => {
  const { servidor, url } = await iniciarServidor();

  try {
    const resposta = await fetch(url);
    assert.equal(resposta.status, 401);
  } finally {
    await new Promise(resolve => servidor.close(resolve));
  }
});

test('POST sem token retorna 401', async () => {
  const { servidor, url } = await iniciarServidor();

  try {
    const resposta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    assert.equal(resposta.status, 401);
  } finally {
    await new Promise(resolve => servidor.close(resolve));
  }
});
