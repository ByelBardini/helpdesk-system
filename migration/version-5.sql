ALTER TABLE `chamados_ti`.`comentarios` 
ADD COLUMN `comentario_observacoes_chamado` TEXT NULL DEFAULT NULL AFTER `comentario_observacoes`;

ALTER TABLE `chamados_ti`.`comentarios` 
ADD COLUMN `comentario_responsavel_id` INT NOT NULL AFTER `comentario_chamado_id`,
ADD INDEX `comentario_responsavel_id_idx` (`comentario_responsavel_id` ASC) VISIBLE;
;
ALTER TABLE `chamados_ti`.`comentarios` 
ADD CONSTRAINT `comentario_responsavel_id`
  FOREIGN KEY (`comentario_responsavel_id`)
  REFERENCES `chamados_ti`.`usuarios` (`usuario_id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
