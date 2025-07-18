ALTER TABLE `chamados_ti`.`agendamentos` 
ADD COLUMN `agendamento_data_conclusao` DATETIME NULL AFTER `agendamento_data`,
CHANGE COLUMN `agendamento_data` `agendamento_data` DATETIME NULL ;
