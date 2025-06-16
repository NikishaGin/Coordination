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


alter table transport
    add column arrest_end_date date comment "Дата снятия ареста" after arrest_sum,
add column arrest_end_cause text comment "Основания снятитя ареста с имущества" after arrest_end_date,
add column person_filed_complaint varchar(255) comment "Лицо, подавшее жалобу" after arrest_end_cause,
add column complaint_date date comment "Дата жалобы" after person_filed_complaint,
add column complaint_subject varchar(255) comment "Предмет жалобы" after complaint_date,
add column complaint_source varchar(255) comment "Орган, рассматривающий жалобу" after complaint_subject,
add column complaint_result text comment "Результат рассмотрения жалобы" after complaint_source;

alter table property
    add column arrest_end_date date comment "Дата снятия ареста" after arrest_sum,
add column arrest_end_cause text comment "Основания снятитя ареста с имущества" after arrest_end_date,
add column person_filed_complaint varchar(255) comment "Лицо, подавшее жалобу" after arrest_end_cause,
add column complaint_date date comment "Дата жалобы" after person_filed_complaint,
add column complaint_subject varchar(255) comment "Предмет жалобы" after complaint_date,
add column complaint_source varchar(255) comment "Орган, рассматривающий жалобу" after complaint_subject,
add column complaint_result text comment "Результат рассмотрения жалобы" after complaint_source;

alter table debit
    add column arrest_end_date date comment "Дата снятия ареста" after arrest_sum,
add column arrest_end_cause text comment "Основания снятитя ареста с имущества" after arrest_end_date,
add column person_filed_complaint varchar(255) comment "Лицо, подавшее жалобу" after arrest_end_cause,
add column complaint_date date comment "Дата жалобы" after person_filed_complaint,
add column complaint_subject varchar(255) comment "Предмет жалобы" after complaint_date,
add column complaint_source varchar(255) comment "Орган, рассматривающий жалобу" after complaint_subject,
add column complaint_result text comment "Результат рассмотрения жалобы" after complaint_source;

alter table another
    add column arrest_end_date date comment "Дата снятия ареста" after arrest_sum,
add column arrest_end_cause text comment "Основания снятитя ареста с имущества" after arrest_end_date,
add column person_filed_complaint varchar(255) comment "Лицо, подавшее жалобу" after arrest_end_cause,
add column complaint_date date comment "Дата жалобы" after person_filed_complaint,
add column complaint_subject varchar(255) comment "Предмет жалобы" after complaint_date,
add column complaint_source varchar(255) comment "Орган, рассматривающий жалобу" after complaint_subject,
add column complaint_result text comment "Результат рассмотрения жалобы" after complaint_source;


ALTER TABLE IF EXISTS another
    ADD COLUMN IF NOT EXISTS realisation1_failure_reason TEXT,
    ADD COLUMN IF NOT EXISTS realisation2_failure_reason TEXT,

ALTER TABLE IF EXISTS transport
    ADD COLUMN IF NOT EXISTS realisation1_failure_reason TEXT,
    ADD COLUMN IF NOT EXISTS realisation2_failure_reason TEXT,

ALTER TABLE IF EXISTS property
    ADD COLUMN IF NOT EXISTS realisation1_failure_reason TEXT,
    ADD COLUMN IF NOT EXISTS realisation2_failure_reason TEXT,

ALTER TABLE IF EXISTS debit
    ADD COLUMN IF NOT EXISTS realisation1_failure_reason TEXT,
    ADD COLUMN IF NOT EXISTS realisation2_failure_reason TEXT,
