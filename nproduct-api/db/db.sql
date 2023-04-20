CREATE DATABASE nproducts;

CREATE TABLE `nproducts`.`teams` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `league` VARCHAR(45) NOT NULL,
  `isActive` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));

INSERT INTO `nproducts`.`teams` (`name`, `league`, `isActive`) 
VALUES 
  ('Real Madrid', 'La Liga', 1),
  ('Barcelona', 'La Liga', 1),
  ('Manchester United', 'Premier League', 1),
  ('Liverpool', 'Premier League', 1),
  ('Arsenal', 'Premier League', 1),
  ('Inter', 'Serie A', 1),
  ('Milan', 'Serie A', 1),
  ('Juventus', 'Serie A', 1)
;
