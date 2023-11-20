CREATE DATABASE db_managbet;

USE db_managbet;

CREATE TABLE usuarios (
  id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, 
  nickname varchar(20) NOT NULL,
  email varchar(60) NOT NULL,
  password varchar(100) NOT NULL,
  admin tinyint NOT NULL
);


/*
CREATE TABLE bookies (
  id int(11) NOT NULL AUTO_INCREMENT,
  usuario_id int(11) NOT NULL,
  bookie varchar(45) NOT NULL,
  saldo int DEFAULT NULL
  PRIMARY KEY (`id`)
  CONSTRAINT `fk_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

describe bookies
*/


CREATE TABLE apuestas (
  id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  usuario_id int(11) NOT NULL,
  /*
  bookie_id int(11) NOT NULL,
  */
  dinero int(45) NOT NULL,
  cuota float NOT NULL,
  estado varchar(45) NOT NULL,
  stake tinyint(2) NOT NULL,
  competicion varchar(120) NOT NULL,
  partido varchar(80) NOT NULL,
  pronostico varchar(45) NOT NULL,
  fecha date NOT NULL,
  created_at timestamp NOT NULL DEFAULT current_timestamp,
  /*
  KEY `idBookie_idx` (`idBookie`),
  CONSTRAINT `fk_bookie` FOREIGN KEY (`bookie_id`) REFERENCES `bookies` (`id`),
  */
  CONSTRAINT fk_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios (id)
);
