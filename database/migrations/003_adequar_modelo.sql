-- ATENCAO: migracao para a estrutura antiga, executar UMA VEZ com backup.
-- Nao executar schema.sql sobre o banco antigo esperando que ALTER seja automatico.
USE controle_financeiro;
ALTER TABLE categorias MODIFY tipo ENUM('receita','despesa','entrada','saida') NOT NULL;
UPDATE categorias SET tipo='entrada' WHERE tipo='receita';
UPDATE categorias SET tipo='saida' WHERE tipo='despesa';
ALTER TABLE categorias MODIFY tipo ENUM('entrada','saida') NOT NULL;
ALTER TABLE categorias ADD CONSTRAINT uq_categorias_nome UNIQUE(usuario_id,nome,tipo);
ALTER TABLE fontes_destinos ADD COLUMN tipo ENUM('renda','conta','cartao_credito') NOT NULL DEFAULT 'conta', ADD COLUMN dia_fechamento TINYINT NULL, ADD COLUMN dia_vencimento TINYINT NULL, ADD COLUMN limite DECIMAL(12,2) NULL;
ALTER TABLE fontes_destinos ADD CONSTRAINT uq_fontes_nome UNIQUE(usuario_id,nome);
ALTER TABLE fontes_destinos ADD CONSTRAINT ck_dias CHECK ((dia_fechamento IS NULL OR dia_fechamento BETWEEN 1 AND 31) AND (dia_vencimento IS NULL OR dia_vencimento BETWEEN 1 AND 31));
ALTER TABLE fontes_destinos ADD CONSTRAINT ck_cartao CHECK (tipo <> 'cartao_credito' OR (dia_fechamento IS NOT NULL AND dia_vencimento IS NOT NULL AND limite > 0));
-- Cria conta padrao para cada usuario existente, sem conta.
INSERT INTO fontes_destinos(usuario_id,nome,tipo)
 SELECT u.id,'Conta corrente','conta' FROM usuarios u
 WHERE NOT EXISTS (SELECT 1 FROM fontes_destinos f WHERE f.usuario_id=u.id AND f.nome='Conta corrente');
ALTER TABLE movimentacoes MODIFY tipo ENUM('receita','despesa','entrada','saida') NOT NULL;
UPDATE movimentacoes SET tipo='entrada' WHERE tipo='receita';
UPDATE movimentacoes SET tipo='saida' WHERE tipo='despesa';
ALTER TABLE movimentacoes MODIFY tipo ENUM('entrada','saida') NOT NULL;
ALTER TABLE movimentacoes ADD COLUMN fonte_destino_id INT NULL, ADD COLUMN parcela_atual TINYINT NOT NULL DEFAULT 1, ADD COLUMN total_parcelas TINYINT NOT NULL DEFAULT 1, ADD COLUMN grupo_parcelamento CHAR(36) NULL;
UPDATE movimentacoes m JOIN fontes_destinos f ON f.usuario_id=m.usuario_id AND f.nome='Conta corrente' SET m.fonte_destino_id=f.id WHERE m.fonte_destino_id IS NULL;
ALTER TABLE movimentacoes MODIFY fonte_destino_id INT NOT NULL;
ALTER TABLE movimentacoes ADD CONSTRAINT fk_movimentacoes_fonte FOREIGN KEY(fonte_destino_id) REFERENCES fontes_destinos(id) ON DELETE RESTRICT;
ALTER TABLE movimentacoes ADD CONSTRAINT ck_parcelas CHECK (total_parcelas BETWEEN 1 AND 48 AND parcela_atual BETWEEN 1 AND total_parcelas);
ALTER TABLE movimentacoes CHANGE data_movimentacao data DATE NOT NULL;
RENAME TABLE movimentacoes TO lancamentos;
ALTER TABLE lancamentos ADD INDEX idx_lancamentos_usuario_data(usuario_id,data);
-- CPF: se migracao 002 deixou valores NULL, preencher com CPFs reais antes de NOT NULL.
-- O script nao inventa CPF para usuarios existentes.
