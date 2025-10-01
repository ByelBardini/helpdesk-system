CREATE TABLE `chamados_ti`.`usuarios` (
  `usuario_id` INT NOT NULL AUTO_INCREMENT,
  `usuario_setor_id` INT NOT NULL,
  `usuario_caminho_foto` VARCHAR(255) NOT NULL,
  `usuario_empresa_id` INT NOT NULL,
  `usuario_nome` VARCHAR(255) NOT NULL,
  `usuario_login` VARCHAR(255) NOT NULL,
  `usuario_senha` VARCHAR(255) NOT NULL,
  `usuario_role` ENUM('adm', 'gerente', 'supervisor', 'liderado') NOT NULL,
  `usuario_ativo` TINYINT NOT NULL,
  `usuario_troca_senha` TINYINT NOT NULL,
  PRIMARY KEY (`usuario_id`));

ALTER TABLE `chamados_ti`.`usuarios` 
CHANGE COLUMN `usuario_empresa_id` `usuario_empresa_id` INT NOT NULL AFTER `usuario_setor_id`;

CREATE TABLE `chamados_ti`.`empresas` (
  `empresa_id` INT NOT NULL AUTO_INCREMENT,
  `empresa_nome` VARCHAR(255) NOT NULL,
  `empresa_cnpj` VARCHAR(50) NULL,
  PRIMARY KEY (`empresa_id`));

CREATE TABLE `chamados_ti`.`setores` (
  `setor_id` INT NOT NULL AUTO_INCREMENT,
  `setor_empresa_id` INT NOT NULL,
  `setor_nome` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`setor_id`),
  INDEX `setor_empresa_id_idx` (`setor_empresa_id` ASC) VISIBLE,
  CONSTRAINT `setor_empresa_id`
    FOREIGN KEY (`setor_empresa_id`)
    REFERENCES `chamados_ti`.`empresas` (`empresa_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

ALTER TABLE `chamados_ti`.`usuarios` 
ADD INDEX `usuario_empresa_id_idx` (`usuario_empresa_id` ASC) VISIBLE,
ADD INDEX `usuario_setor_id_idx` (`usuario_setor_id` ASC) VISIBLE;
;
ALTER TABLE `chamados_ti`.`usuarios` 
ADD CONSTRAINT `usuario_empresa_id`
  FOREIGN KEY (`usuario_empresa_id`)
  REFERENCES `chamados_ti`.`empresas` (`empresa_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `usuario_setor_id`
  FOREIGN KEY (`usuario_setor_id`)
  REFERENCES `chamados_ti`.`setores` (`setor_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `chamados_ti`.`setores` 
DROP FOREIGN KEY `setor_empresa_id`;
ALTER TABLE `chamados_ti`.`setores` 
ADD CONSTRAINT `setor_empresa_id`
  FOREIGN KEY (`setor_empresa_id`)
  REFERENCES `chamados_ti`.`empresas` (`empresa_id`)
  ON DELETE CASCADE;

ALTER TABLE `chamados_ti`.`usuarios` 
CHANGE COLUMN `usuario_caminho_foto` `usuario_caminho_foto` VARCHAR(255) NULL ;

CREATE TABLE `chamados_ti`.`faq` (
  `pergunta_id` INT NOT NULL,
  `pergunta_categoria` VARCHAR(50) NOT NULL,
  `pergunta_titulo` VARCHAR(255) NOT NULL,
  `pergunta_resposta` TEXT NOT NULL,
  PRIMARY KEY (`pergunta_id`));

ALTER TABLE `chamados_ti`.`faq` 
CHANGE COLUMN `pergunta_id` `pergunta_id` INT NOT NULL AUTO_INCREMENT ;

CREATE TABLE `chamados_ti`.`avisos` (
  `aviso_id` INT NOT NULL AUTO_INCREMENT,
  `aviso_data` DATE NOT NULL,
  `aviso_titulo` VARCHAR(255) NOT NULL,
  `aviso_descricao` TEXT NOT NULL,
  PRIMARY KEY (`aviso_id`));

ALTER TABLE `chamados_ti`.`avisos` 
ADD COLUMN `aviso_importancia` ENUM('baixa', 'media', 'alta') NOT NULL AFTER `aviso_descricao`;

CREATE TABLE `chamados_ti`.`areas` (
  `area_id` INT NOT NULL AUTO_INCREMENT,
  `area_nome` VARCHAR(100) NOT NULL,
  `area_tipo` ENUM('erro', 'solicitacao', 'melhoria') NOT NULL,
  PRIMARY KEY (`area_id`));

CREATE TABLE `chamados_ti`.`chamados` (
  `chamado_id` INT NOT NULL AUTO_INCREMENT,
  `chamado_empresa_id` INT NOT NULL,
  `chamado_setor_id` INT NOT NULL,
  `chamado_usuario_id` INT NOT NULL,
  `chamado_area_id` INT NOT NULL,
  `chamado_data_abertura` DATE NOT NULL,
  `chamado_status` ENUM('em aberto', 'visualizado', 'resolvendo', 'resolvido') NOT NULL,
  `chamado_tipo` ENUM('erro', 'melhoria', 'solicitacao') NOT NULL,
  `chamado_motivo` VARCHAR(75) NOT NULL,
  `chamado_descricao` TEXT NOT NULL,
  `chamado_data_conclusao` DATE NULL,
  `chamado_prioridade` ENUM('baixa', 'media', 'alta', 'urgente') NULL,
  `chamado_responsavel_id` INT NULL,
  PRIMARY KEY (`chamado_id`),
  INDEX `usuario_empresa_id_idx` (`chamado_empresa_id` ASC) VISIBLE,
  INDEX `usuario_setor_id_idx` (`chamado_setor_id` ASC) VISIBLE,
  INDEX `chamado_usuario_id_idx` (`chamado_usuario_id` ASC) VISIBLE,
  INDEX `chamado_area_id_idx` (`chamado_area_id` ASC) VISIBLE,
  INDEX `chamado_responsavel_id_idx` (`chamado_responsavel_id` ASC) VISIBLE,
  CONSTRAINT `chamado_empresa_id`
    FOREIGN KEY (`chamado_empresa_id`)
    REFERENCES `chamados_ti`.`empresas` (`empresa_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `chamado_setor_id`
    FOREIGN KEY (`chamado_setor_id`)
    REFERENCES `chamados_ti`.`setores` (`setor_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `chamado_usuario_id`
    FOREIGN KEY (`chamado_usuario_id`)
    REFERENCES `chamados_ti`.`usuarios` (`usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `chamado_area_id`
    FOREIGN KEY (`chamado_area_id`)
    REFERENCES `chamados_ti`.`areas` (`area_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `chamado_responsavel_id`
    FOREIGN KEY (`chamado_responsavel_id`)
    REFERENCES `chamados_ti`.`usuarios` (`usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `chamados_ti`.`anexos` (
  `anexo_id` INT NOT NULL AUTO_INCREMENT,
  `anexo_chamado_id` INT NOT NULL,
  `anexo_nome` VARCHAR(50) NOT NULL,
  `anexo_caminho` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`anexo_id`),
  INDEX `anexo_chamado_id_idx` (`anexo_chamado_id` ASC) VISIBLE,
  CONSTRAINT `anexo_chamado_id`
    FOREIGN KEY (`anexo_chamado_id`)
    REFERENCES `chamados_ti`.`chamados` (`chamado_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

CREATE TABLE `chamados_ti`.`respostas` (
  `resposta_id` INT NOT NULL AUTO_INCREMENT,
  `resposta_chamado_id` INT NOT NULL,
  `resposta_tipo` ENUM('suporte', 'usuario') NOT NULL,
  `resposta_visualizada` TINYINT NOT NULL DEFAULT 0,
  `resposta_data_emissao` DATE NOT NULL,
  PRIMARY KEY (`resposta_id`),
  INDEX `resposta_chamado_id_idx` (`resposta_chamado_id` ASC) VISIBLE,
  CONSTRAINT `resposta_chamado_id`
    FOREIGN KEY (`resposta_chamado_id`)
    REFERENCES `chamados_ti`.`chamados` (`chamado_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

ALTER TABLE `chamados_ti`.`respostas` 
ADD COLUMN `resposta_descricao` TEXT NOT NULL AFTER `resposta_chamado_id`;

ALTER TABLE `chamados_ti`.`respostas` 
ADD COLUMN `resposta_usuario_id` INT NOT NULL AFTER `resposta_chamado_id`,
ADD INDEX `resposta_usuario_id_idx` (`resposta_usuario_id` ASC) VISIBLE;
;
ALTER TABLE `chamados_ti`.`respostas` 
ADD CONSTRAINT `resposta_usuario_id`
  FOREIGN KEY (`resposta_usuario_id`)
  REFERENCES `chamados_ti`.`usuarios` (`usuario_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `chamados_ti`.`anexos` 
DROP FOREIGN KEY `anexo_chamado_id`;
ALTER TABLE `chamados_ti`.`anexos` 
ADD COLUMN `anexo_resposta_id` INT NULL AFTER `anexo_chamado_id`,
CHANGE COLUMN `anexo_chamado_id` `anexo_chamado_id` INT NULL ,
ADD INDEX `anexo_resposta_id_idx` (`anexo_resposta_id` ASC) VISIBLE;
;
ALTER TABLE `chamados_ti`.`anexos` 
ADD CONSTRAINT `anexo_chamado_id`
  FOREIGN KEY (`anexo_chamado_id`)
  REFERENCES `chamados_ti`.`chamados` (`chamado_id`),
ADD CONSTRAINT `anexo_resposta_id`
  FOREIGN KEY (`anexo_resposta_id`)
  REFERENCES `chamados_ti`.`respostas` (`resposta_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `chamados_ti`.`usuarios` 
CHANGE COLUMN `usuario_role` `usuario_role` ENUM('adm', 'gerente', 'supervisor', 'liderado', 'suporte') NOT NULL ;

ALTER TABLE `chamados_ti`.`usuarios` 
DROP FOREIGN KEY `usuario_setor_id`;
ALTER TABLE `chamados_ti`.`usuarios` 
CHANGE COLUMN `usuario_setor_id` `usuario_setor_id` INT NULL ;
ALTER TABLE `chamados_ti`.`usuarios` 
ADD CONSTRAINT `usuario_setor_id`
  FOREIGN KEY (`usuario_setor_id`)
  REFERENCES `chamados_ti`.`setores` (`setor_id`)
  ON DELETE SET NULL;
  
ALTER TABLE `chamados_ti`.`empresas` 
ADD COLUMN `empresa_ativa` TINYINT NOT NULL DEFAULT 1 AFTER `empresa_cnpj`;

ALTER TABLE `chamados_ti`.`setores` 
ADD COLUMN `setor_ativo` TINYINT NOT NULL DEFAULT 1 AFTER `setor_nome`;

ALTER TABLE `chamados_ti`.`areas` 
ADD COLUMN `area_ativa` TINYINT NOT NULL DEFAULT 1 AFTER `area_tipo`;

ALTER TABLE `chamados_ti`.`chamados` 
ADD COLUMN `chamado_resolucao` VARCHAR(255) NULL AFTER `chamado_data_conclusao`;

CREATE TABLE `chamados_ti`.`compras` (
  `compra_id` INT NOT NULL AUTO_INCREMENT,
  `compra_empresa_id` INT NOT NULL,
  `compra_setor_id` INT NOT NULL,
  `compra_solicitante_id` INT NOT NULL,
  `compra_item` VARCHAR(75) NOT NULL,
  `compra_quantidade` INT NOT NULL,
  `compra_motivo` VARCHAR(255) NOT NULL,
  `compra_data` DATE NOT NULL,
  `compra_status` ENUM('em analise', 'aprovado', 'recusado') NOT NULL,
  `compra_valor` DOUBLE NULL,
  `compra_motivo_recusa` VARCHAR(255) NULL,
  PRIMARY KEY (`compra_id`),
  INDEX `compra_empresa_id_idx` (`compra_empresa_id` ASC) VISIBLE,
  INDEX `compra_setor_id_idx` (`compra_setor_id` ASC) VISIBLE,
  INDEX `compra_solicitante_id_idx` (`compra_solicitante_id` ASC) VISIBLE,
  CONSTRAINT `compra_empresa_id`
    FOREIGN KEY (`compra_empresa_id`)
    REFERENCES `chamados_ti`.`empresas` (`empresa_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `compra_setor_id`
    FOREIGN KEY (`compra_setor_id`)
    REFERENCES `chamados_ti`.`setores` (`setor_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `compra_solicitante_id`
    FOREIGN KEY (`compra_solicitante_id`)
    REFERENCES `chamados_ti`.`usuarios` (`usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

ALTER TABLE `chamados_ti`.`compras` 
ADD COLUMN `compra_tipo` ENUM("produto", "servico") NOT NULL AFTER `compra_item`,
CHANGE COLUMN `compra_quantidade` `compra_quantidade` INT NULL ;

ALTER TABLE `chamados_ti`.`compras` 
ADD COLUMN `compra_recebida` ENUM("a caminho", "recebida") NULL AFTER `compra_valor`;
