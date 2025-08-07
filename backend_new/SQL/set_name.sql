ALTER TABLE coordination_new.settings COMMENT = 'Таблица настроки сервиса - включение/выключение сервисного режима';
ALTER TABLE coordination_new.library COMMENT = 'Таблица "Библиотека"';
ALTER TABLE coordination_new.regions COMMENT = 'Таблица "Регионы"';
ALTER TABLE coordination_new.sosp COMMENT = 'Таблица "СОСП"';
ALTER TABLE coordination_new.tno COMMENT = 'Таблица "ТНО"';
ALTER TABLE coordination_new.client_categories COMMENT = 'Таблица "Категории должников"';
ALTER TABLE coordination_new.users COMMENT = 'Таблица "Пользователи сервиса"';
ALTER TABLE coordination_new.history COMMENT = 'Таблица "История изменений в сервисе"';
ALTER TABLE coordination_new.clients COMMENT = 'Таблица "Должники"';
ALTER TABLE coordination_new.interactions COMMENT = 'Таблица "Взаимодействия"';
ALTER TABLE coordination_new.resolutions COMMENT = 'Таблица "Постановления"';
ALTER TABLE coordination_new.actives COMMENT = 'Таблица "Активы должника"';
ALTER TABLE coordination_new.description_actives COMMENT = 'Таблица "Описания имущества"';
ALTER TABLE coordination_new.arrests COMMENT = 'Таблица "Аресты имущества"';
ALTER TABLE coordination_new.wanteds COMMENT = 'Таблица "Розыски имущества"';
ALTER TABLE coordination_new.evaluations COMMENT = 'Таблица "Оценки имущества"';
ALTER TABLE coordination_new.encumbrances COMMENT = 'Таблица "Обременения имущества"';
ALTER TABLE coordination_new.realizations COMMENT = 'Таблица "Реализации имущества"';
ALTER TABLE coordination_new.refund_property COMMENT = 'Таблица "Возвраты имущества должнику"';
ALTER TABLE coordination_new.debit_foreclosure COMMENT = 'Таблица "Обращения взыскания на дебиторскую задолженость"';
ALTER TABLE coordination_new.active_registrations COMMENT = 'Таблица "Регистрации активов"';
ALTER TABLE coordination_new.complaints COMMENT = 'Таблица "Жалобы"';

ALTER TABLE coordination_new.settings
MODIFY COLUMN serviceMode tinyint(1) COMMENT 'Сервисный режим';

ALTER TABLE coordination_new.library
MODIFY COLUMN ;

ALTER TABLE coordination_new.regions
MODIFY COLUMN ;

ALTER TABLE coordination_new.sosp
MODIFY COLUMN ;

ALTER TABLE coordination_new.tno
MODIFY COLUMN ;

ALTER TABLE coordination_new.client_categories
MODIFY COLUMN ;

ALTER TABLE coordination_new.users
MODIFY COLUMN ;

ALTER TABLE coordination_new.history
MODIFY COLUMN ;

ALTER TABLE coordination_new.clients
MODIFY COLUMN ;

ALTER TABLE coordination_new.interactions
MODIFY COLUMN ;

ALTER TABLE coordination_new.resolutions
MODIFY COLUMN ;

ALTER TABLE coordination_new.actives
MODIFY COLUMN ;

ALTER TABLE coordination_new.description_actives
MODIFY COLUMN ;

ALTER TABLE coordination_new.arrests
MODIFY COLUMN ;

ALTER TABLE coordination_new.wanteds
MODIFY COLUMN ;

ALTER TABLE coordination_new.evaluations
MODIFY COLUMN ;

ALTER TABLE coordination_new.encumbrances
MODIFY COLUMN ;

ALTER TABLE coordination_new.realizations
MODIFY COLUMN ;

ALTER TABLE coordination_new.refund_property
MODIFY COLUMN ;

ALTER TABLE coordination_new.debit_foreclosure
MODIFY COLUMN ;

ALTER TABLE coordination_new.active_registrations
MODIFY COLUMN ;

ALTER TABLE coordination_new.complaints
MODIFY COLUMN ;