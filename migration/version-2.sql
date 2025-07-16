ALTER TABLE `chamados_ti`.`empresas` 
ADD COLUMN `empresa_cor` VARCHAR(20) NOT NULL AFTER `empresa_nome`,
ADD COLUMN `empresa_imagem` BLOB NOT NULL AFTER `empresa_cor`;