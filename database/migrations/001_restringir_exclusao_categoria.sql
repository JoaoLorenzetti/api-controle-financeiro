
USE controle_financeiro;

ALTER TABLE movimentacoes
DROP FOREIGN KEY fk_movimentacoes_categoria;

ALTER TABLE movimentacoes
ADD CONSTRAINT fk_movimentacoes_categoria
FOREIGN KEY (categoria_id)
REFERENCES categorias(id)
ON DELETE RESTRICT;
