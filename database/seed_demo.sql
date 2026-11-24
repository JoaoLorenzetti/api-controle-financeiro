-- Execute SOMENTE no banco de desenvolvimento/testes, apos criar um usuario pela API.
-- Troque @usuario pelo ID do usuario de demonstracao. Nao altera outros usuarios.
SET @usuario = 1;
INSERT INTO lancamentos (usuario_id,tipo,descricao,valor,data,categoria_id,fonte_destino_id)
SELECT @usuario,'entrada','Salario demonstracao',2500.00,'2026-11-05',c.id,f.id
FROM categorias c JOIN fontes_destinos f ON f.usuario_id=c.usuario_id
WHERE c.usuario_id=@usuario AND c.nome='Salário' AND c.tipo='entrada' AND f.nome='Conta corrente'
AND NOT EXISTS (SELECT 1 FROM lancamentos l WHERE l.usuario_id=@usuario AND l.descricao='Salario demonstracao' AND l.data='2026-11-05');
INSERT INTO lancamentos (usuario_id,tipo,descricao,valor,data,categoria_id,fonte_destino_id)
SELECT @usuario,'saida','Mercado demonstracao',175.50,'2026-11-08',c.id,f.id
FROM categorias c JOIN fontes_destinos f ON f.usuario_id=c.usuario_id
WHERE c.usuario_id=@usuario AND c.nome='Alimentação' AND c.tipo='saida' AND f.nome='Conta corrente'
AND NOT EXISTS (SELECT 1 FROM lancamentos l WHERE l.usuario_id=@usuario AND l.descricao='Mercado demonstracao' AND l.data='2026-11-08');
