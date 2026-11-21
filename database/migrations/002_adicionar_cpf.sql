USE controle_financeiro;

ALTER TABLE usuarios
ADD COLUMN cpf CHAR(11) NULL;

ALTER TABLE usuarios
ADD CONSTRAINT uq_usuarios_cpf UNIQUE (cpf);