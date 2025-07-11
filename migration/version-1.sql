CREATE SCHEMA `chamados_ti` ;

-- Tabela de empresas e setores por empresa
CREATE TABLE `chamados_ti`.`empresas` (
  `empresa_id` INT NOT NULL AUTO_INCREMENT,
  `empresa_nome` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`empresa_id`));

CREATE TABLE `chamados_ti`.`setores` (
  `setor_id` INT NOT NULL AUTO_INCREMENT,
  `setor_empresa_id` INT NOT NULL,
  `setor_nome` VARCHAR(45) NULL,
  PRIMARY KEY (`setor_id`),
  INDEX `setor_empresa_id_idx` (`setor_empresa_id` ASC) VISIBLE,
  CONSTRAINT `setor_empresa_id`
    FOREIGN KEY (`setor_empresa_id`)
    REFERENCES `chamados_ti`.`empresas` (`empresa_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- Tabela de usuários
CREATE TABLE `chamados_ti`.`usuarios` (
  `usuario_id` INT NOT NULL AUTO_INCREMENT,
  `usuario_empresa_id` INT NOT NULL,
  `usuario_setor_id` INT NOT NULL,
  `usuario_nome` VARCHAR(100) NOT NULL,
  `usuario_email` VARCHAR(150) NOT NULL,
  `usuario_telefone` VARCHAR(20) NOT NULL,
  `usuario_cargo` VARCHAR(100) NOT NULL,
  `usuario_senha_hash` VARCHAR(255) NOT NULL,
  `usuario_role` ENUM('comum', 'responsavel', 'admin') NOT NULL,
  `usuario_ativo` TINYINT NOT NULL DEFAULT 1,
  `usuario_data_criacao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuario_id`),
  INDEX `usuario_empresa_id_idx` (`usuario_empresa_id` ASC) VISIBLE,
  INDEX `usuario_setor_id_idx` (`usuario_setor_id` ASC) VISIBLE,
  CONSTRAINT `usuario_empresa_id`
    FOREIGN KEY (`usuario_empresa_id`)
    REFERENCES `chamados_ti`.`empresas` (`empresa_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `usuario_setor_id`
    FOREIGN KEY (`usuario_setor_id`)
    REFERENCES `chamados_ti`.`setores` (`setor_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- Tabela de categorias de chamados (plataforma, etc)
CREATE TABLE `chamados_ti`.`categorias` (
  `categoria_id` INT NOT NULL AUTO_INCREMENT,
  `categoria_nome` VARCHAR(100) NOT NULL,
  `categoria_tipo` ENUM('problema', 'solicitacao') NOT NULL,
  PRIMARY KEY (`categoria_id`));

-- Tabela do status do chamado ou agendamento
CREATE TABLE `chamados_ti`.`status` (
  `status_id` INT NOT NULL AUTO_INCREMENT,
  `status_nome` VARCHAR(50) NOT NULL,
  `status_tipo` ENUM('chamado', 'agendamento') NOT NULL,
  PRIMARY KEY (`status_id`));

-- Tabela de prioridade dos chamados
CREATE TABLE `chamados_ti`.`prioridades` (
  `prioridade_id` INT NOT NULL AUTO_INCREMENT,
  `prioridade_nome` VARCHAR(50) NOT NULL,
  `prioridade_ordem` INT NOT NULL,
  PRIMARY KEY (`prioridade_id`));

-- Tabela do impacto dos chamados
CREATE TABLE `chamados_ti`.`impactos` (
  `impacto_id` INT NOT NULL AUTO_INCREMENT,
  `impacto_nome` VARCHAR(50) NOT NULL,
  `impacto_descricao` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`impacto_id`));

-- Tabela de chamados
CREATE TABLE `chamados_ti`.`chamados` (
  `chamado_id` INT NOT NULL,
  `chamado_usuario_id` INT NOT NULL,
  `chamado_setor_id` INT NOT NULL,
  `chamado_responsavel_id` INT NULL,
  `chamado_categoria_id` INT NOT NULL,
  `chamado_status_id` INT NOT NULL,
  `chamado_prioridade_id` INT NOT NULL,
  `chamado_impacto_id` INT NOT NULL,
  `chamado_tipo` ENUM('problema', 'solicitacao') NOT NULL,
  `chamado_motivo` VARCHAR(100) NOT NULL,
  `chamado_descricao` TEXT NOT NULL,
  `chamado_prazo` DATE NULL,
  `chamado_data_abertura` DATETIME NOT NULL,
  `chamado_data_fechamento` DATE NULL,
  PRIMARY KEY (`chamado_id`),
  INDEX `chamado_usuario_id_idx` (`chamado_usuario_id` ASC) VISIBLE,
  INDEX `chamado_setor_id_idx` (`chamado_setor_id` ASC) VISIBLE,
  INDEX `chamado_categoria_id_idx` (`chamado_categoria_id` ASC) VISIBLE,
  INDEX `chamado_status_id_idx` (`chamado_status_id` ASC) VISIBLE,
  INDEX `chamado_prioridade_id_idx` (`chamado_prioridade_id` ASC) VISIBLE,
  INDEX `chamado_impacto_id_idx` (`chamado_impacto_id` ASC) VISIBLE,
  CONSTRAINT `chamado_usuario_id`
    FOREIGN KEY (`chamado_usuario_id`)
    REFERENCES `chamados_ti`.`usuarios` (`usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `chamado_setor_id`
    FOREIGN KEY (`chamado_setor_id`)
    REFERENCES `chamados_ti`.`setores` (`setor_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `chamado_categoria_id`
    FOREIGN KEY (`chamado_categoria_id`)
    REFERENCES `chamados_ti`.`categorias` (`categoria_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `chamado_status_id`
    FOREIGN KEY (`chamado_status_id`)
    REFERENCES `chamados_ti`.`status` (`status_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `chamado_prioridade_id`
    FOREIGN KEY (`chamado_prioridade_id`)
    REFERENCES `chamados_ti`.`prioridades` (`prioridade_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `chamado_impacto_id`
    FOREIGN KEY (`chamado_impacto_id`)
    REFERENCES `chamados_ti`.`impactos` (`impacto_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- Tabela de anexos dos chamados
CREATE TABLE `chamados_ti`.`anexos` (
  `anexo_id` INT NOT NULL AUTO_INCREMENT,
  `anexo_chamado_id` INT NOT NULL,
  `anexo_caminho_arquivo` VARCHAR(255) NOT NULL,
  `anexo_descricao` VARCHAR(255) NULL,
  `anexo_data_upload` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`anexo_id`),
  INDEX `anexo_id_chamado_idx` (`anexo_chamado_id` ASC) VISIBLE,
  CONSTRAINT `anexo_id_chamado`
    FOREIGN KEY (`anexo_chamado_id`)
    REFERENCES `chamados_ti`.`chamados` (`chamado_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- Tabela dos agendamentos
CREATE TABLE `chamados_ti`.`agendamentos` (
  `agendamento_id` INT NOT NULL,
  `agendamento_chamado_id` INT NOT NULL,
  `agendamento_status_id` INT NOT NULL,
  `agendamento_motivo` VARCHAR(255) NOT NULL,
  `agendamento_data` DATETIME NOT NULL,
  PRIMARY KEY (`agendamento_id`),
  INDEX `agendamento_chamado_id_idx` (`agendamento_chamado_id` ASC) VISIBLE,
  INDEX `agendamento_status_ud_idx` (`agendamento_status_id` ASC) VISIBLE,
  CONSTRAINT `agendamento_chamado_id`
    FOREIGN KEY (`agendamento_chamado_id`)
    REFERENCES `chamados_ti`.`chamados` (`chamado_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `agendamento_status_ud`
    FOREIGN KEY (`agendamento_status_id`)
    REFERENCES `chamados_ti`.`status` (`status_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- Tabela de comentários dos chamados
CREATE TABLE `chamados_ti`.`comentarios` (
  `comentario_id` INT NOT NULL,
  `comentario_chamado_id` INT NOT NULL,
  `comentario_solucao_aplicada` TEXT NULL,
  `comentario_classificacao_pos` VARCHAR(100) NULL,
  `comentario_observacoes` TEXT NULL,
  `comentario_ticket_outro_sistema` VARCHAR(100) NULL,
  `comentario_data` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`comentario_id`),
  INDEX `comentario_chamado_id_idx` (`comentario_chamado_id` ASC) VISIBLE,
  CONSTRAINT `comentario_chamado_id`
    FOREIGN KEY (`comentario_chamado_id`)
    REFERENCES `chamados_ti`.`chamados` (`chamado_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- Tabela de logs de acessos
CREATE TABLE `chamados_ti`.`logs_acessos` (
  `acesso_id` INT NOT NULL,
  `acesso_id_usuario` INT NOT NULL,
  `acesso_data_acesso` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `acesso_status_login` TINYINT NOT NULL,
  PRIMARY KEY (`acesso_id`),
  INDEX `acesso_id_usuario_idx` (`acesso_id_usuario` ASC) VISIBLE,
  CONSTRAINT `acesso_id_usuario`
    FOREIGN KEY (`acesso_id_usuario`)
    REFERENCES `chamados_ti`.`usuarios` (`usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

-- Tabela de logs de ações dos chamados
CREATE TABLE `chamados_ti`.`logs_alteracoes` (
  `alteracao_id` INT NOT NULL,
  `alteracao_chamado_id` INT NOT NULL,
  `alteracao_usuario_id` INT NOT NULL,
  `alteracao_campo_alterado` VARCHAR(100) NOT NULL,
  `alteracao_valor_antigo` TEXT NOT NULL,
  `alteracao_valor_novo` TEXT NOT NULL,
  `alteracao_data_alteracao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`alteracao_id`),
  INDEX `alteracao_chamado_id_idx` (`alteracao_chamado_id` ASC) VISIBLE,
  INDEX `alteracao_usuario_id_idx` (`alteracao_usuario_id` ASC) VISIBLE,
  CONSTRAINT `alteracao_chamado_id`
    FOREIGN KEY (`alteracao_chamado_id`)
    REFERENCES `chamados_ti`.`chamados` (`chamado_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `alteracao_usuario_id`
    FOREIGN KEY (`alteracao_usuario_id`)
    REFERENCES `chamados_ti`.`usuarios` (`usuario_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);