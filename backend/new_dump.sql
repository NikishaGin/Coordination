CREATE TABLE `library` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `source` VARCHAR(50) NOT NULL,
    `original_filename` VARCHAR(250) NOT NULL,
    `new_filename` VARCHAR(250) NOT NULL,
    PRIMARY KEY (`id`)
);


CREATE TABLE `interactions` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `inn` VARCHAR(12),
    `source` VARCHAR(50) NOT NULL,
    `referral_date` DATE,
    `review_date` DATE,
    `result` VARCHAR(50),
    `kno` VARCHAR(4),
    `note` TEXT,
    `filename_1` VARCHAR(250),
    `filename_2` VARCHAR(250),
    PRIMARY KEY (`id`)
)