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
