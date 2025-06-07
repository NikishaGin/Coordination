CREATE TABLE `library` (
   `id` INT NOT NULL AUTO_INCREMENT,
   `source` VARCHAR(50) NOT NULL,
   `originalFilename` VARCHAR(250) NOT NULL,
   `systemsFilename` VARCHAR(250) NOT NULL,
   PRIMARY KEY (`id`)
);


CREATE TABLE `interactions` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `inn` VARCHAR(12),
    `source` VARCHAR(50) NOT NULL,
    `submissionDate` DATE,
    `reviewDate` DATE,
    `result` VARCHAR(50),
    `kno` VARCHAR(4),
    `note` TEXT,
    `originalFilename_1` VARCHAR(250),
    `originalFilename_2` VARCHAR(250),
    `systemsFilename_1` VARCHAR(250),
    `systemsFilename_2` VARCHAR(250),
    PRIMARY KEY (`id`)
);



ALTER TABLE users
    MODIFY COLUMN role ENUM('admin', 'user', 'limited_admin', 'gmu_limited_admin', 'gmu_arkhangelsk_admin') DEFAULT 'user' NOT NULL;

DELETE FROM `users` WHERE username = "gmu";

INSERT INTO `users` (username, region, surname, password, role)
VALUES ("gmu", "0000", "Архангельск - ГМУ", "$2b$10$XDXDW4Zxqk6WCd52Xt359ectAx0e.bmQgxQ3ADmkt.cJeUlJRxLGS", "gmu_arkhangelsk_admin")