# API de Controle Financeiro

API REST para controle financeiro pessoal, desenvolvida como projeto acadêmico da disciplina **Programação Web Back-end**.

A proposta é permitir que cada usuário registre suas entradas e saídas, organize as movimentações por categorias e fontes ou destinos, acompanhe compras parceladas e consulte relatórios financeiros. A comunicação é feita por HTTP e JSON, sem interface gráfica.

## Funcionalidades do projeto

- Cadastro de usuários e autenticação por e-mail e senha.
- Senhas armazenadas com hash usando `bcrypt`.
- Autenticação por token JWT e proteção das rotas privadas.
- Cadastro, consulta, edição e exclusão de categorias.
- Cadastro, consulta, edição e exclusão de fontes e destinos, incluindo contas e cartões de crédito.
- Registro de entradas e saídas, com filtros e paginação.
- Registro de compras parceladas em cartões de crédito.
- Relatórios de movimentações por categoria e por fonte ou destino.
- Previsão das faturas atuais e futuras dos cartões de crédito.
- Isolamento dos dados: cada usuário acessa somente seus próprios registros.
- Como funcionalidade extra, possibilidade de disponibilizar indicadores e projeções de saúde financeira.

## Tecnologias

- **Node.js** e **NPM**
- **Express** para criação da API REST
- **MySQL** para persistência dos dados
- **mysql2** para conexão e consultas ao banco
- **jsonwebtoken** e **express-jwt** para autenticação e proteção das rotas
- **bcrypt** para hash de senhas
- **dotenv** para configuração por variáveis de ambiente
- **nodemon** para execução durante o desenvolvimento

O projeto utiliza o sistema de módulos **CommonJS**, com `require` e `module.exports`.

## Organização do projeto

A estrutura prevista para a aplicação é:

```text
api-controle-financeiro/
├── database/
│   ├── connection.js
│   ├── schema.sql
│   └── seed.sql
├── middleware/
│   └── auth.js
├── models/
├── routes/
├── utils/
├── testes/
│   └── requisicoes.md
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

As responsabilidades são separadas da seguinte forma:

- `database/`: conexão e scripts de criação e carga inicial do banco.
- `middleware/`: middleware de autenticação JWT.
- `models/`: classes responsáveis pelas consultas SQL e pelo acesso aos dados.
- `routes/`: definição das rotas e validação das requisições.
- `utils/`: funções auxiliares, como validação de CPF, divisão de parcelas e cálculo de faturas.
- `testes/`: requisições usadas para testar os recursos da API.
- `server.js`: configuração e inicialização do servidor Express.

As instruções SQL devem ficar nos arquivos de `models/`. As rotas recebem e validam os dados, chamam os modelos e retornam as respostas em JSON.

## Modelo de dados

O banco utilizado pela aplicação é `api_financas`. O modelo principal contém quatro entidades:

| Entidade | Finalidade |
|---|---|
| `usuarios` | Armazena os dados dos usuários, com e-mail e CPF únicos e senha protegida por hash. |
| `categorias` | Classifica as movimentações como entrada ou saída. |
| `fontes_destinos` | Representa a origem ou o destino do dinheiro, como salário, conta corrente ou cartão de crédito. |
| `lancamentos` | Registra cada movimentação financeira, vinculada ao usuário, à categoria e à fonte ou destino. |

Cada usuário possui suas próprias categorias, fontes/destinos e lançamentos. As relações são garantidas por chaves estrangeiras. O banco também utiliza restrições `UNIQUE` e `CHECK` para reforçar regras como a unicidade de e-mail e CPF e a proibição de valores de lançamento menores ou iguais a zero.

### Regras importantes

- Um lançamento deve ser do tipo `entrada` ou `saida`.
- O valor do lançamento deve ser maior que zero. O tipo define se o valor representa uma entrada ou uma saída.
- A categoria deve possuir o mesmo tipo do lançamento.
- A categoria e a fonte/destino informadas devem pertencer ao usuário autenticado.
- Uma fonte/destino do tipo `cartao_credito` deve possuir dia de fechamento, dia de vencimento e limite.
- Compras parceladas podem gerar de 1 a 48 lançamentos, um para cada parcela.
- E-mail e CPF são normalizados antes do cadastro e possuem restrições de unicidade no banco.

## Requisitos para execução

Antes de iniciar, é necessário ter instalado:

- Node.js e NPM.
- MySQL 8.0.16 ou superior.
- Git, para clonar o repositório.

## Instalação e configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/JoaoLorenzetti/api-controle-financeiro.git
cd api-controle-financeiro
```

### 2. Instalar as dependências

```bash
npm install
```

Caso as dependências ainda não estejam registradas no `package.json`, instale as bibliotecas utilizadas pelo projeto:

```bash
npm install express mysql2 jsonwebtoken express-jwt bcrypt dotenv
npm install --save-dev nodemon
```

### 3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto, utilizando o `.env.example` como referência:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_do_mysql
DB_NAME=api_financas
JWT_SECRET=troque_por_uma_chave_longa_e_aleatoria
```

Ajuste os dados de conexão conforme a configuração do seu MySQL. A variável `JWT_SECRET` deve conter uma chave secreta própria.

**Importante:** o arquivo `.env` contém informações privadas e não deve ser enviado ao Git. O `.gitignore` deve conter, no mínimo:

```gitignore
node_modules/
.env
```

O repositório deve manter o arquivo `.env.example`, com nomes de variáveis e valores fictícios, para orientar a configuração em outros computadores.

### 4. Criar e popular o banco de dados

Execute primeiro o script `database/schema.sql`, responsável pela criação do banco e das tabelas. Depois, execute `database/seed.sql`, que contém os dados iniciais para teste e demonstração.

Pelo cliente de linha de comando do MySQL, no **Prompt de Comando do Windows (cmd)** ou em um terminal compatível:

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p api_financas < database/seed.sql
```

Também é possível abrir os dois arquivos no MySQL Workbench e executá-los na mesma ordem. O arquivo de carga inicial deve conter pelo menos dois usuários e três meses de lançamentos, incluindo uma compra parcelada em cartão de crédito.

### 5. Iniciar a API

Modo de desenvolvimento, com reinicialização automática:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Por padrão, a API utiliza a porta `3000`. Quando o servidor iniciar, estará disponível em:

```text
http://localhost:3000
```

## Autenticação

O cadastro e o login são as únicas operações públicas. As demais rotas exigem um token JWT válido.

Após realizar o login, copie o token retornado e envie-o no cabeçalho `Authorization` das requisições protegidas:

```http
Authorization: Bearer SEU_TOKEN_AQUI
```

O token possui tempo de expiração. Uma requisição sem token, com token inválido ou expirado deve retornar `401 Unauthorized`.

O identificador do usuário utilizado nas consultas deve vir do token autenticado. A API não deve confiar em um `usuarioId` enviado pelo corpo, pela URL ou pela query string. Registros pertencentes a outro usuário devem ser tratados como não encontrados, com resposta `404`.

## Endpoints

As rotas abaixo descrevem os recursos previstos para a API. Os exemplos de parâmetros são ilustrativos.

### Autenticação

| Método | Rota | Descrição | Autenticação |
|---|---|---|---|
| `POST` | `/auth/cadastro` | Cadastra um usuário, cria categorias padrão e uma conta corrente padrão. | Não |
| `POST` | `/auth/login` | Valida as credenciais e retorna um token JWT. | Não |
| `GET` | `/auth/me` | Retorna os dados básicos do usuário autenticado. | Sim |

### Categorias

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/categorias` | Lista as categorias do usuário. Aceita o filtro opcional `tipo`. |
| `POST` | `/categorias` | Cria uma categoria. |
| `PUT` | `/categorias/:id` | Atualiza uma categoria do usuário. |
| `DELETE` | `/categorias/:id` | Exclui uma categoria, desde que não existam lançamentos vinculados. |

### Fontes e destinos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/fontes-destinos` | Lista as fontes e os destinos do usuário. |
| `POST` | `/fontes-destinos` | Cadastra uma fonte ou destino. |
| `PUT` | `/fontes-destinos/:id` | Atualiza uma fonte ou destino do usuário. |
| `DELETE` | `/fontes-destinos/:id` | Exclui uma fonte ou destino, respeitando os vínculos existentes. |

Os tipos aceitos são `renda`, `conta` e `cartao_credito`. Para cartões de crédito, devem ser informados dia de fechamento, dia de vencimento e limite.

### Lançamentos

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/lancamentos` | Lista os lançamentos com filtros e paginação. |
| `GET` | `/lancamentos/:id` | Consulta os detalhes de um lançamento. |
| `POST` | `/lancamentos` | Registra uma entrada, uma saída ou uma compra parcelada. |
| `PUT` | `/lancamentos/:id` | Atualiza um lançamento. |
| `DELETE` | `/lancamentos/:id` | Exclui um lançamento. Aceita `todasParcelas=true` para excluir todas as parcelas da mesma compra. |

A listagem aceita os seguintes parâmetros opcionais:

| Parâmetro | Finalidade |
|---|---|
| `inicio` | Data inicial do período (`AAAA-MM-DD`). |
| `fim` | Data final do período (`AAAA-MM-DD`). |
| `tipo` | Tipo do lançamento: `entrada` ou `saida`. |
| `categoriaId` | Filtra por categoria. |
| `fonteDestinoId` | Filtra por fonte ou destino. |
| `pagina` | Número da página. São retornados 20 registros por página. |

Sem um período informado, a listagem utiliza o mês corrente. A resposta também deve apresentar o total de entradas, o total de saídas e o saldo do período.

### Relatórios

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/relatorios/categorias?inicio=AAAA-MM-DD&fim=AAAA-MM-DD` | Apresenta entradas e saídas por categoria, percentuais e comparação com o período anterior. |
| `GET` | `/relatorios/fontes-destinos?inicio=AAAA-MM-DD&fim=AAAA-MM-DD` | Apresenta entradas por fonte, saídas por destino e saldo das contas. |
| `GET` | `/relatorios/faturas?meses=3` | Apresenta a fatura atual e as próximas faturas dos cartões de crédito. |

Os parâmetros `inicio` e `fim` dos relatórios por período são obrigatórios e devem conter datas válidas, com a data inicial menor ou igual à data final. No relatório de faturas, `meses` aceita valores de 1 a 12 e utiliza 3 como padrão.

### Saúde financeira (funcionalidade extra)

O endpoint `GET /saude-financeira` é um desafio opcional. Ele pode retornar indicadores, projeções mensais e dicas calculadas com base nos dados do usuário, como taxa de poupança, comprometimento com cartões, parcelas futuras e projeção de saldo.

As informações retornadas por esse recurso devem conter um aviso de que possuem caráter educativo e não constituem recomendação financeira profissional.

## Compras parceladas e faturas

Quando uma compra é registrada em um cartão de crédito com parcelamento, a API gera um lançamento para cada parcela. Todas as parcelas compartilham o mesmo identificador de grupo e a mesma data da compra.

A divisão deve ser feita em centavos para evitar diferenças no valor total. Por exemplo, uma compra de R$ 100,00 em três parcelas deve resultar em R$ 33,34, R$ 33,33 e R$ 33,33.

A previsão das faturas considera o dia de fechamento e o dia de vencimento de cada cartão. Compras realizadas antes do dia de fechamento entram na fatura que fecha no mesmo mês. Compras feitas no dia do fechamento ou depois entram na fatura seguinte. As parcelas seguintes são distribuídas nos meses posteriores.

## Respostas e códigos HTTP

As respostas da API são fornecidas em JSON, exceto nas operações de exclusão bem-sucedidas que retornam `204 No Content` sem corpo.

| Código | Utilização |
|---|---|
| `200 OK` | Consultas, atualizações e login realizados com sucesso. |
| `201 Created` | Cadastro de usuário, categoria, fonte/destino ou lançamento. |
| `204 No Content` | Exclusão realizada com sucesso. |
| `400 Bad Request` | Dados obrigatórios ausentes, formatos inválidos ou regras de negócio violadas. |
| `401 Unauthorized` | Token ausente, inválido ou expirado, ou credenciais de login incorretas. |
| `404 Not Found` | Rota ou registro inexistente, inclusive quando o registro pertence a outro usuário. |
| `409 Conflict` | E-mail ou CPF duplicado, nome duplicado ou tentativa de excluir registro com lançamentos vinculados. |
| `500 Internal Server Error` | Erro inesperado no servidor. |

As respostas de erro seguem um formato padronizado. Exemplo:

```json
{
  "erro": "Dados inválidos.",
  "campos": {
    "valor": "O valor deve ser maior que zero."
  }
}
```

## Testes da API

As rotas podem ser testadas utilizando `curl`, Postman, Insomnia ou Thunder Client (extensão do VS Code).

Os comandos e exemplos utilizados para validar os recursos devem ficar documentados em `testes/requisicoes.md` ou em uma coleção exportada do Postman/Insomnia.

Durante os testes, é importante verificar também os casos de erro, como:

- Cadastro com e-mail ou CPF já utilizado.
- Login com credenciais incorretas.
- Acesso a rota protegida sem token.
- Tentativa de consultar ou alterar registros pertencentes a outro usuário.
- Lançamento com valor inválido ou categoria incompatível com o tipo da movimentação.
- Compra parcelada e distribuição correta dos centavos entre as parcelas.
- Compra feita no dia do fechamento do cartão.

## Segurança

- Senhas são armazenadas somente em formato de hash, nunca em texto puro.
- A chave JWT e as credenciais do banco são lidas do `.env`.
- Consultas SQL utilizam parâmetros (`?`) para evitar a montagem insegura de comandos com dados recebidos nas requisições.
- As rotas privadas exigem autenticação.
- Cada consulta deve limitar os resultados ao usuário identificado pelo token.
- As respostas da API não devem expor `senha_hash` nem detalhes internos de erros do servidor.

## Observações

Este projeto tem finalidade acadêmica. Bibliotecas adicionais às previstas no enunciado da disciplina devem ser aprovadas pelo professor antes de serem utilizadas.
