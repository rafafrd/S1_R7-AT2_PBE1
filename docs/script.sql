-- drop DATABASE rapido_seguro_db;
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
-- Table `rapido_seguro_db`.`status_entrega`
-- -----------------------------------------------------
-- Tabela de para os status da entrega
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
-- Tabela para os tipos de entrega
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`tipo_entrega` (
    `id_tipo_entrega` INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primária da tabela, identificador único do tipo de entrega.',
    `tipo_entrega` ENUM("urgente", "normal") NOT NULL COMMENT 'Descrição do tipo de entrega (urgente ou normal).',
    PRIMARY KEY (`id_tipo_entrega`)
) ENGINE = InnoDB COMMENT = 'Armazena os possíveis tipos de entrega (normal ou urgente).';

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`pedidos`
-- -----------------------------------------------------
-- Tabela para armazenar o registro dos pedidos de entrega
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`pedidos` (
    `id_pedido` INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primária da tabela, identificador único do pedido.',
    `id_cliente` INT NOT NULL COMMENT 'Chave estrangeira que referencia o cliente que fez o pedido.',
    `id_tipo_entrega` INT NOT NULL COMMENT 'Chave estrangeira que referencia o tipo de entrega (urgente ou normal).',
    `valor_base_distancia` DECIMAL(10, 2) NOT NULL COMMENT 'Valor base por quilômetro (km) para o cálculo da distância.',
    `distancia_km` DECIMAL(10, 2) COMMENT 'Distância percorrida para a entrega em quilômetros (km).',
    `valor_base_carga` DECIMAL(10, 2) NOT NULL COMMENT 'Valor base por quilograma (kg) da carga.',
    `peso_carga` INT NOT NULL COMMENT 'Peso da carga em quilogramas (kg).',
    `data_pedido` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data e hora em que o pedido foi registrado.',
    PRIMARY KEY (`id_pedido`),
    INDEX `FK_pedidos_clientes_idx` (`id_cliente` ASC) VISIBLE,
    INDEX `FK_pedidos_tipo_entrega_idx` (`id_tipo_entrega` ASC) VISIBLE,
    CONSTRAINT `FK_pedidos_clientes` FOREIGN KEY (`id_cliente`) REFERENCES `rapido_seguro_db`.`clientes` (`id_cliente`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `FK_pedidos_tipo_entrega` FOREIGN KEY (`id_tipo_entrega`) REFERENCES `rapido_seguro_db`.`tipo_entrega` (`id_tipo_entrega`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB COMMENT = 'Armazena os dados básicos e de carga do pedido de entrega.';

-- -----------------------------------------------------
-- Table `rapido_seguro_db`.`entregas`
-- -----------------------------------------------------
-- Tabela para armazenar o cálculo e registro final da entrega
CREATE TABLE IF NOT EXISTS `rapido_seguro_db`.`entregas` (
    `id_entrega` INT NOT NULL AUTO_INCREMENT COMMENT 'Chave primária da tabela, identificador único da entrega.',
    `id_pedido` INT COMMENT 'Chave estrangeira que referencia o pedido relacionado.',
    `valor_distancia` DECIMAL(10, 2) NOT NULL COMMENT 'Cálculo: distância * valor base por km.',
    `valor_peso` DECIMAL(10, 2) COMMENT 'Cálculo: peso da carga * valor base por kg.',
    `acrescimo` DECIMAL(10, 2) NOT NULL COMMENT 'Valor do acréscimo em R$ (20% se for urgente, 0 se normal).',
    `desconto` DECIMAL(10, 2) NOT NULL COMMENT 'Valor do desconto em R$ (10% se valor final > R$ 500,00, 0 caso contrário).',
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

-- populando basicos
INSERT INTO `tipo_entrega` (`tipo_entrega`) VALUES 
('normal'), 
('urgente');

-- Inserir os status possíveis
INSERT INTO `status_entrega` (`status_entrega`) VALUES 
('calculado'), 
('em transito'), 
('entregue'), 
('cancelado');


-- trigger entrega 
-- DELIMITER $$

-- CREATE TRIGGER trg_gerar_entrega_apos_pedido
-- AFTER INSERT ON `pedidos`
-- FOR EACH ROW
-- BEGIN

--     DECLARE v_valor_distancia DECIMAL(10, 2);
--     DECLARE v_valor_peso DECIMAL(10, 2);
--     DECLARE v_valor_base_total DECIMAL(10, 2);
--     DECLARE v_acrescimo DECIMAL(10, 2);
--     DECLARE v_desconto DECIMAL(10, 2);
--     DECLARE v_taxa_extra DECIMAL(10, 2);
--     DECLARE v_valor_final DECIMAL(10, 2);
--     DECLARE v_nome_tipo_entrega VARCHAR(20);
--     DECLARE v_valor_com_acrescimo_taxa DECIMAL(10, 2);

--     -- 1. Calculando os valores bases
--     SET v_valor_distancia = NEW.distancia_km * NEW.valor_base_distancia;
--     SET v_valor_peso = NEW.peso_carga * NEW.valor_base_carga;
--     SET v_valor_base_total = v_valor_distancia + v_valor_peso;

--     -- 2. Buscando o tipo da entrega usando a FK recém-adicionada (NEW.id_tipo_entrega)
--     SELECT tipo_entrega INTO v_nome_tipo_entrega 
--     FROM tipo_entrega 
--     WHERE id_tipo_entrega = NEW.id_tipo_entrega; -- AGORA FUNCIONA

--     -- 3. Regra: Acréscimo de 20% se for "urgente"
--     IF v_nome_tipo_entrega = 'urgente' THEN
--         SET v_acrescimo = v_valor_base_total * 0.20;
--     ELSE
--         SET v_acrescimo = 0.00;
--     END IF;

--     -- 4. Regra: Taxa extra se pesar mais de 50kg
--     IF NEW.peso_carga > 50 THEN
--         SET v_taxa_extra = 15.00;
--     ELSE
--         SET v_taxa_extra = 0.00;
--     END IF;

--     -- 5. Valor intermediário (Valor Base + Acréscimo + Taxa Extra) para verificar desconto
--     SET v_valor_com_acrescimo_taxa = v_valor_base_total + v_acrescimo + v_taxa_extra;

--     -- 6. Regra: Desconto de 10% se passar de R$ 500,00
--     IF v_valor_com_acrescimo_taxa > 500.00 THEN
--         SET v_desconto = v_valor_com_acrescimo_taxa * 0.10;
--     ELSE
--         SET v_desconto = 0.00;
--     END IF;

--     -- 7. Cálculo Total 
--     SET v_valor_final = v_valor_com_acrescimo_taxa - v_desconto;

--     -- 8. INSERT na tabela 'entregas'
--     INSERT INTO `entregas` (
--         id_pedido,
--         valor_distancia,
--         valor_peso,
--         acrescimo,
--         desconto,
--         taxa_extra,
--         valor_final,
--         id_status_entrega,
--         id_tipo_entrega
--     ) VALUES (
--         NEW.id_pedido,
--         v_valor_distancia,
--         v_valor_peso,
--         v_acrescimo,
--         v_desconto,
--         v_taxa_extra,
--         v_valor_final,
--         1, -- Define status inicial como 'calculado' (assumindo que ID 1 é 'calculado')
--         NEW.id_tipo_entrega
--     );

-- END$$
-- DELIMITER ;
