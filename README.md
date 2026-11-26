# API de Controle Financeiro
API REST acadêmica em Node.js, Express, mysql2, JWT e bcrypt. Sem interface gráfica.

## Instalação
1. Instale Node.js e MySQL/MariaDB.
2. Execute `npm install`.
3. Crie o banco: `mysql -u root -p < database/schema.sql`.
4. Copie `.env.example` para `.env` e configure as credenciais e JWT_SECRET. Não versione o .env.
5. Em um banco novo e vazio, execute `mysql -u root -p controle_financeiro < database/seed.sql` (opcional, dados fictícios; não repetir sobre banco preenchido).
6. Execute `npm run dev` ou `npm start`. Porta padrão 3000.

## Estrutura
`config/database.js`: conexão; `models/`: SQL; `controllers/`: validações; `routes/`: endpoints; `middlewares/`: autenticação; `utils/`: regras puras; `database/`: schema e seed; `tests/`: testes automatizados.

## Rotas
- POST /auth/cadastro, POST /auth/login, GET /auth/me
- GET/POST /categorias; GET/PUT/DELETE /categorias/:id (conforme router)
- GET/POST /fontes-destinos; GET/PUT/DELETE /fontes-destinos/:id (conforme router)
- GET/POST /lancamentos; GET/PUT/DELETE /lancamentos/:id
- GET /relatorios/categorias e /relatorios/fontes-destinos (inicio e fim obrigatórios)
- GET /relatorios/faturas?meses=3 (fatura aberta e três seguintes)
- GET /faturas/cartoes, /faturas/cartoes/:id e /faturas/cartoes/:id/projecao

Use Authorization: Bearer TOKEN nas rotas protegidas. Variação percentual sem base anterior é null quando há valor novo. As parcelas mantêm a data original e são distribuídas por ciclo de fechamento. Limites consideram parcelas com vencimento igual ou posterior à data atual.

## Testes
Execute `node --test`. Consulte `testes/requisicoes.md` para o roteiro HTTP. Usuários fictícios do seed: ana.demo@example.com e bruno.demo@example.com, senha Demo12345.
