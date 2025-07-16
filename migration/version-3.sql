ALTER TABLE `chamados_ti`.`usuarios` 
ADD COLUMN `usuario_login` VARCHAR(50) NOT NULL AFTER `usuario_cargo`;

ALTER TABLE `chamados_ti`.`usuarios` 
ADD UNIQUE INDEX `usuario_login_UNIQUE` (`usuario_login` ASC) VISIBLE;
;