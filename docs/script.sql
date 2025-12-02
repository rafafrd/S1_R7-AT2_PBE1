SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0;

SET
    @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS,
    FOREIGN_KEY_CHECKS = 0;

SET
    @OLD_SQL_MODE = @@SQL_MODE,
    SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema rapido_seguro_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema rapido_seguro_db
-- -----------------------------------------------------
-- Definição do esquema do banco de dados para o sistema Rápido & Seguro Logística
CREATE SCHEMA IF NOT EXISTS `rapido_seguro_db` DEFAULT CHARACTER SET utf8;

USE `rapido_seguro_db`;

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`clientes`
-- -----------------------------------------------------
-- Tabela para armazenar informações dos clientes
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`clientes` (
    `id_cliente` INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primária da tabela, identificador único do cliente.',
    `nome` VARCHAR(100) NOT NULL COMMENT 'Nome completo do cliente.',
    `cpf` VARCHAR(11) NOT NULL COMMENT 'CPF do cliente. Deve ser único.',
    `email` VARCHAR(100) NOT NULL COMMENT 'E-mail principal do cliente. Deve ser único.',
    UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) VISIBLE,
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
    PRIMARY KEY (`id_cliente`)
) ENGINE = InnoDB COMMENT = 'Armazena o cadastro básico dos clientes.';

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`telefones`
-- -----------------------------------------------------
-- Tabela para armazenar os telefones dos clientes (um cliente pode ter vários)
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`telefones` (
    `id_telefone` INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primária da tabela, identificador único do telefone.',
    `telefone` VARCHAR(11) NOT NULL COMMENT 'Número de telefone. Deve ser único.',
    `id_cliente` INT NOT NULL COMMENT 'Chave estrangeira que referencia o cliente proprietário do telefone.',
    PRIMARY KEY (`id_telefone`),
    UNIQUE INDEX `telefone_UNIQUE` (`telefone` ASC) VISIBLE,
    INDEX `fk_clientes_telefones_idx` (`id_cliente` ASC) VISIBLE,
    CONSTRAINT `fk_telefones_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `rapido_seguro_db`.`clientes` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB COMMENT = 'Armazena os múltiplos telefones de contato dos clientes.';

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`enderecos`
-- -----------------------------------------------------
-- Tabela para armazenar os endereços dos clientes (um cliente pode ter vários)
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`enderecos` (
    `id_endereco` INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primária da tabela, identificador único do endereço.',
    `logradouro` VARCHAR(100) NOT NULL COMMENT 'Rua, avenida, etc. Obtido via VIACEP.',
    `numero` INT NOT NULL COMMENT 'Número do imóvel.',
    `bairro` VARCHAR(100) NOT NULL COMMENT 'Bairro. Obtido via VIACEP.',
    `complemento` VARCHAR(50) NULL COMMENT 'Complemento do endereço (opcional).',
    `cidade` VARCHAR(100) NOT NULL COMMENT 'Cidade. Obtido via VIACEP.',
    
    `estado` VARCHAR(50) NOT NULL COMMENT 'Estado. Obtido via VIACEP.',
    `cep` VARCHAR(8) NOT NULL COMMENT 'CEP do endereço. Obtido via VIACEP.',
    `id_cliente` INT NOT NULL COMMENT 'Chave estrangeira que referencia o cliente proprietário do endereço.',
    PRIMARY KEY (`id_endereco`),
    INDEX `FK_clientes_endereco_idx` (`id_cliente` ASC) VISIBLE,
    CONSTRAINT `FK_enderecos_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `rapido_seguro_db`.`clientes` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB COMMENT = 'Armazena os múltiplos endereços de entrega dos clientes.';

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`pedidos`
-- -----------------------------------------------------
-- Tabela para armazenar o registro dos pedidos de entrega
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`pedidos` (
    `id_pedido` INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primária da tabela, identificador único do pedido.',
    `id_cliente` INT NOT NULL COMMENT 'Chave estrangeira que referencia o cliente que fez o pedido.',
    `valor_base_distancia` DECIMAL(10, 2) NOT NULL COMMENT 'Valor base por quilômetro (km) para o cálculo da distância.',
    `distancia_km` DECIMAL(10, 2) COMMENT 'Distância percorrida para a entrega em quilômetros (km).',
    `valor_base_carga` DECIMAL(10, 2) NOT NULL COMMENT 'Valor base por quilograma (kg) da carga.',
    `peso_carga` INT NOT NULL COMMENT 'Peso da carga em quilogramas (kg).',
    `data_pedido` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data e hora em que o pedido foi registrado.',
    PRIMARY KEY (`id_pedido`),
    INDEX `FK_pedidos_clientes_idx` (`id_cliente` ASC) VISIBLE,
    CONSTRAINT `FK_pedidos_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `rapido_seguro_db`.`clientes` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB COMMENT = 'Armazena os dados básicos e de carga do pedido de entrega.';

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`status_entrega`
-- -----------------------------------------------------
-- Tabela de lookup para os possíveis status da entrega
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`status_entrega` (
    `id_status_entrega` INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primária da tabela, identificador único do status.',
    `status_entrega` ENUM(
        "calculado",
        "em transito",
        "entregue",
        "cancelado"
    ) NOT NULL COMMENT 'Descrição do status da entrega (calculado, em transito, entregue, cancelado).',
    PRIMARY KEY (`id_status_entrega`)
) ENGINE = InnoDB COMMENT = 'Armazena os possíveis status de uma entrega.';

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`tipo_entrega`
-- -----------------------------------------------------
-- Tabela de lookup para os tipos de entrega
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`tipo_entrega` (
    `id_tipo_entrega` INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primária da tabela, identificador único do tipo de entrega.',
    `tipo_entrega` ENUM("urgente", "normal") NOT NULL COMMENT 'Descrição do tipo de entrega (urgente ou normal).',
    PRIMARY KEY (`id_tipo_entrega`)
) ENGINE = InnoDB COMMENT = 'Armazena os possíveis tipos de entrega (normal ou urgente).';

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`entregas`
-- -----------------------------------------------------
-- Tabela para armazenar o cálculo e registro final da entrega
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`entregas` (
    `id_entrega` INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primária da tabela, identificador único da entrega.',
    `id_pedido` INT COMMENT 'Chave estrangeira que referencia o pedido relacionado.',
    `valor_distancia` DECIMAL(10, 2) NOT NULL COMMENT 'Cálculo: distância * valor base por km.',
    `valor_peso` DECIMAL(10, 2) COMMENT 'Cálculo: peso da carga * valor base por kg.',
    `acrescimo` INT NOT NULL COMMENT 'Valor do acréscimo em R$ (20% se for urgente, 0 se normal).',
    `desconto` INT NOT NULL COMMENT 'Valor do desconto em R$ (10% se valor final > R$ 500,00, 0 caso contrário).',
    `taxa_extra` DECIMAL(10, 2) NOT NULL COMMENT 'Valor da taxa fixa extra em R$ (R$ 15,00 se peso > 50kg, 0 caso contrário).',
    `valor_final` DECIMAL(10, 2) NOT NULL COMMENT 'Valor final da entrega após todos os cálculos (Valor Base + Acréscimo - Desconto + Taxa Extra).',
    `id_status_entrega` INT COMMENT 'Chave estrangeira que referencia o status atual da entrega.',
    `id_tipo_entrega` INT COMMENT 'Chave estrangeira que referencia o tipo de entrega (normal ou urgente).',
    PRIMARY KEY (`id_entrega`),
    INDEX `FK_entrega_pedido_idx` (`id_pedido` ASC) VISIBLE,
    INDEX `FK_entrega_status_entrega_idx` (`id_status_entrega` ASC) VISIBLE,
    INDEX `FK_entrega_tipo_entrega_idx` (`id_tipo_entrega` ASC) VISIBLE,
    CONSTRAINT `FK_entrega_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `rapido_seguro_db`.`pedidos` (`id_pedido`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_entrega_status_entrega` FOREIGN KEY (`id_status_entrega`) REFERENCES `rapido_seguro_db`.`status_entrega` (`id_status_entrega`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_entrega_tipo_entrega` FOREIGN KEY (`id_tipo_entrega`) REFERENCES `rapido_seguro_db`.`tipo_entrega` (`id_tipo_entrega`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB COMMENT = 'Armazena os dados calculados do custo e o status da entrega.';

SET SQL_MODE = @OLD_SQL_MODE;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;