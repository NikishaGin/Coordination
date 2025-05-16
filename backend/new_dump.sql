CREATE TABLE `library` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `source` VARCHAR(50) NOT NULL,
    `original_filename` VARCHAR(250) NOT NULL,
    `new_filename` VARCHAR(250) NOT NULL,
    PRIMARY KEY (`id`)
);