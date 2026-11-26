# Roteiro HTTP
Execute em banco de testes com seed. Use IDs reais retornados pelas listagens.

```bash
BASE=http://localhost:3000
curl -i "$BASE/health"
curl -i -X POST "$BASE/auth/cadastro" -H 'Content-Type: application/json' -d '{"nome":"Teste HTTP","email":"http@example.com","cpf":"12345678909","senha":"Teste12345"}'
TOKEN=$(curl -s -X POST "$BASE/auth/login" -H 'Content-Type: application/json' -d '{"email":"ana.demo@example.com","senha":"Demo12345"}' | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).token")
A="Authorization: Bearer $TOKEN"
curl -i "$BASE/auth/me" -H "$A"
curl -i "$BASE/usuarios" -H "$A"
curl -i "$BASE/lancamentos" # 401
curl -i "$BASE/categorias" -H "$A"
curl -i "$BASE/fontes-destinos" -H "$A"
curl -i "$BASE/lancamentos?inicio=2026-09-01&fim=2026-11-30" -H "$A"
curl -i "$BASE/relatorios/categorias?inicio=2026-11-01&fim=2026-11-30" -H "$A"
curl -i "$BASE/relatorios/fontes-destinos?inicio=2026-11-01&fim=2026-11-30" -H "$A"
curl -i "$BASE/relatorios/categorias" -H "$A" # 400
curl -i "$BASE/relatorios/faturas?mes=2026-12&meses=3" -H "$A"
curl -i "$BASE/faturas/cartoes" -H "$A"
# Substitua IDs antes de executar:
curl -i "$BASE/faturas/cartoes/ID?mes=2026-12" -H "$A"
curl -i "$BASE/faturas/cartoes/ID/projecao?mes=2026-12&meses=3" -H "$A"
```

Para cada recurso categorias, fontes-destinos e lancamentos: teste POST com JSON válido, GET da lista, GET por ID se disponível, PUT com os campos obrigatórios e DELETE do registro criado. Use categoria de saída e fonte do próprio usuário para lançamento. Teste categoria incompatível (400), token ausente (401), ID de outro usuário (404), duplicidade (409). Teste compra de 300 em três parcelas, confirme 100 em cada fatura e exclusão com `?todasParcelas=true`. O notebook do seed fecha em dezembro, janeiro e fevereiro, vencendo em janeiro, fevereiro e março. Registre os resultados reais antes da entrega.
