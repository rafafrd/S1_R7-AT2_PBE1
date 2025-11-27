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
CREATE SCHEMA IF NOT EXISTS `rapido_seguro_db` DEFAULT CHARACTER SET utf8;

USE `rapido_seguro_db`;

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`clientes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`clientes` (
    `id_cliente` INT NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `cpf` VARCHAR(11) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) VISIBLE,
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
    PRIMARY KEY (`id_cliente`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`telefones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`telefones` (
    `id_telefone` INT NOT NULL AUTO_INCREMENT,
    `telefone` VARCHAR(11) NOT NULL,
    `id_cliente` INT NOT NULL,
    PRIMARY KEY (`id_telefone`),
    UNIQUE INDEX `telefone_UNIQUE` (`telefone` ASC) VISIBLE,
    INDEX `fk_clientes_telefones_idx` (`id_cliente` ASC) VISIBLE,
    CONSTRAINT `fk_telefones_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `rapido_seguro_db`.`clientes` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`enderecos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`enderecos` (
    `id_endereco` INT NOT NULL AUTO_INCREMENT,
    `logradouro` VARCHAR(100) NOT NULL,
    `numero` INT NOT NULL,
    `bairro` VARCHAR(100) NOT NULL,
    `complemento` VARCHAR(50) NULL,
    `cidade` VARCHAR(100) NOT NULL,
    `estado` VARCHAR(50) NOT NULL,
    `cep` VARCHAR(8) NOT NULL,
    `id_cliente` INT NOT NULL,
    PRIMARY KEY (`id_endereco`),
    INDEX `FK_clientes_endereco_idx` (`id_cliente` ASC) VISIBLE,
    CONSTRAINT `FK_enderecos_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `rapido_seguro_db`.`clientes` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`pedido` (
    `id_pedido` INT NOT NULL AUTO_INCREMENT,
    `id_cliente` INT NOT NULL,
    `data_pedido` TIMESTAMP NOT NULL,
    `peso_carga` INT NOT NULL,
    PRIMARY KEY (`id_pedido`),
    INDEX `FK_pedidos_clientes_idx` (`id_cliente` ASC) VISIBLE,
    CONSTRAINT `FK_pedidos_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `rapido_seguro_db`.`clientes` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`status_entrega`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`status_entrega` (
    `id_status_entrega` INT NOT NULL AUTO_INCREMENT,
    `status_entrega` ENUM(
        "calculado",
        "em transito",
        "entregue",
        "cancelado"
    ) NOT NULL,
    PRIMARY KEY (`id_status_entrega`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`tipo_entrega`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`tipo_entrega` (
    `id_tipo_entrega` INT NOT NULL AUTO_INCREMENT,
    `tipo_entrega` ENUM("urgente", "normal") NOT NULL,
    PRIMARY KEY (`id_tipo_entrega`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`entrega`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`entrega` (
    `id_entrega` INT NOT NULL AUTO_INCREMENT,
    `id_pedido` INT NOT NULL,
    `valor_distancia` DECIMAL(10, 2) NOT NULL,
    `valor_peso` DECIMAL(10, 2) NOT NULL,
    `acrescimo` INT NOT NULL,
    `desconto` INT NOT NULL,
    `taxa_extra` DECIMAL(10, 2) NOT NULL,
    `valor_final` DECIMAL(10, 2) NOT NULL,
    `id_status_entrega` INT NOT NULL,
    `id_tipo_entrega` INT NOT NULL,
    PRIMARY KEY (`id_entrega`),
    INDEX `FK_entrega_pedido_idx` (`id_pedido` ASC) VISIBLE,
    INDEX `FK_entrega_status_entrega_idx` (`id_status_entrega` ASC) VISIBLE,
    INDEX `FK_entrega_tipo_entrega_idx` (`id_tipo_entrega` ASC) VISIBLE,
    CONSTRAINT `FK_entrega_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `rapido_seguro_db`.`pedido` (`id_pedido`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_entrega_status_entrega` FOREIGN KEY (`id_status_entrega`) REFERENCES `rapido_seguro_db`.`status_entrega` (`id_status_entrega`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_entrega_tipo_entrega` FOREIGN KEY (`id_tipo_entrega`) REFERENCES `rapido_seguro_db`.`tipo_entrega` (`id_tipo_entrega`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

SET SQL_MODE = @OLD_SQL_MODE;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;