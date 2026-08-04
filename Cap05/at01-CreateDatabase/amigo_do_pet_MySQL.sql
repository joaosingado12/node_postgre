-- Instalar o HeidiSQL e iniciar o MySQL no Xampp
CREATE DATABASE IF NOT EXISTS amigo_do_pet
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE amigo_do_pet;

-- Tabela de Usuários (Donos e Interessados)
CREATE TABLE usuarios (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    telefone VARCHAR(15),
    whatsapp VARCHAR(15),
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
) ENGINE=InnoDB;
-- Criação de um Registro ADMIM na entidade forte
INSERT INTO usuarios (
    nome, 
    cpf, 
    telefone, 
    whatsapp, 
    email, 
    senha
) VALUES (
    'Admin', 
    '12345678901', 
    '17991234567', 
    '17991234567', 
    'admin.dev@amigosdopet.com', 
    'teste123'
);
-- Tabela de Pets
CREATE TABLE pets (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_cli INT UNSIGNED NOT NULL, 
    nome VARCHAR(50) NOT NULL,
    sexo ENUM('M', 'F'),
    especie VARCHAR(30) NOT NULL,
    raca VARCHAR(50),
    peso DECIMAL(5,2),
    tamanho VARCHAR(20),
    idade INT,
    doenca VARCHAR(255),
    obs TEXT,
    CONSTRAINT fk_pet_usuario 
        FOREIGN KEY (id_cli) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Tabela de Doações
CREATE TABLE doacoes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    id_pet INT UNSIGNED NOT NULL,
    id_cli_interesse INT UNSIGNED,
    data_interesse DATE,
    data_doacao DATE,
    status VARCHAR(50),
    CONSTRAINT fk_doacoes_pet 
        FOREIGN KEY (id_pet) REFERENCES pets(id) ON DELETE CASCADE,
    CONSTRAINT fk_doacoes_usuario 
        FOREIGN KEY (id_cli_interesse) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB;