# Roteiro de testes e demonstracao

## Preparacao
1. `npm install` e configure `.env` (nao versionar credenciais).
2. Crie o banco de testes a partir de `database/schema.sql`, ajustando o nome do banco para ambiente local.
3. Inicie a API: `npm run dev`.
4. Cadastre um usuario em `POST /auth/cadastro` e obtenha o JWT em `POST /auth/login`.
5. Para dados de demonstracao, confira o ID em `usuarios`, ajuste `@usuario` no arquivo `database/seed_demo.sql` e rode o SQL somente no banco de testes.

## Fluxo da apresentacao
- Login e autenticacao JWT.
- CRUD de categorias, fontes/destinos e lancamentos.
- Relatorios: `GET /relatorios/categorias?inicio=2026-11-01&fim=2026-11-30` e `GET /relatorios/fontes-destinos?inicio=2026-11-01&fim=2026-11-30`.
- Cadastre um cartao por `POST /fontes-destinos` (tipo `cartao_credito`, com dias e limite).
- Faturas: `GET /faturas/cartoes`, `GET /faturas/cartoes/ID?mes=2026-11` e `GET /faturas/cartoes/ID/projecao?mes=2026-11&meses=3`.
- Mostre respostas 401 sem token e 400 para filtros invalidos.

## Comandos de validacao
`node --test`
`git diff --check`

## Limitacoes conhecidas
- A projecao soma somente lancamentos cadastrados, sem estimar gastos futuros.
- O parcelamento existente armazena parcelas com a mesma data; a fatura agrupa pela data registrada e nao calcula automaticamente vencimentos das parcelas futuras.
- Nao executar migracoes antigas diretamente sobre banco novo sem conferir a compatibilidade.
