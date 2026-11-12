
require('dotenv').config();

const express = require('express');
const app = express();

const apiRoutes = require('./routes');

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Controle Financeiro funcionando!'
  });
});

// Registra as rotas da API
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
