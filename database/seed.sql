-- Somente banco de desenvolvimento. Senha dos dois usuários: Demo12345.
START TRANSACTION;
INSERT INTO usuarios(nome,email,cpf,senha_hash) VALUES
('Demo Ana','ana.demo@example.com','52998224725','$2b$10$KSARBS1b0hnq3z6FGgsl5eMCkVaR5/Ki4SmHye8fOSBcByXW24KyC'),
('Demo Bruno','bruno.demo@example.com','11144477735','$2b$10$KSARBS1b0hnq3z6FGgsl5eMCkVaR5/Ki4SmHye8fOSBcByXW24KyC');
SET @a=(SELECT id FROM usuarios WHERE email='ana.demo@example.com');
SET @b=(SELECT id FROM usuarios WHERE email='bruno.demo@example.com');
INSERT INTO categorias(usuario_id,nome,tipo)
SELECT u.id,c.nome,c.tipo FROM usuarios u CROSS JOIN (
SELECT 'Salário' nome,'entrada' tipo UNION ALL SELECT 'Outras entradas','entrada' UNION ALL SELECT 'Alimentação','saida' UNION ALL SELECT 'Moradia','saida' UNION ALL SELECT 'Saúde','saida' UNION ALL SELECT 'Mobilidade','saida' UNION ALL SELECT 'Lazer','saida' UNION ALL SELECT 'Educação','saida' UNION ALL SELECT 'Outras saídas','saida') c WHERE u.id IN (@a,@b);
INSERT INTO fontes_destinos(usuario_id,nome,tipo) VALUES (@a,'Conta corrente','conta'),(@b,'Conta corrente','conta');
INSERT INTO fontes_destinos(usuario_id,nome,tipo,dia_fechamento,dia_vencimento,limite) VALUES (@a,'Cartão Demo','cartao_credito',25,5,5000);
INSERT INTO lancamentos(usuario_id,tipo,descricao,valor,data,categoria_id,fonte_destino_id)
SELECT c.usuario_id,c.tipo,CONCAT(c.nome,' demo'),IF(c.tipo='entrada',3000,350),d.data,c.id,f.id FROM categorias c JOIN fontes_destinos f ON f.usuario_id=c.usuario_id AND f.tipo='conta' CROSS JOIN (SELECT '2026-09-05' data UNION ALL SELECT '2026-10-05' UNION ALL SELECT '2026-11-05') d WHERE c.usuario_id IN (@a,@b) AND c.nome IN ('Salário','Alimentação');
SET @grupo=UUID();
INSERT INTO lancamentos(usuario_id,tipo,descricao,valor,data,categoria_id,fonte_destino_id,parcela_atual,total_parcelas,grupo_parcelamento)
SELECT @a,'saida','Notebook demo',100,'2026-11-25',c.id,f.id,n.k,3,@grupo FROM categorias c JOIN fontes_destinos f ON f.usuario_id=c.usuario_id CROSS JOIN (SELECT 1 k UNION ALL SELECT 2 UNION ALL SELECT 3) n WHERE c.usuario_id=@a AND c.nome='Educação' AND f.tipo='cartao_credito';
COMMIT;
