DELETE FROM coordination_new.complaints WHERE id >= 0;
DELETE FROM coordination_new.active_registrations WHERE id >= 0;
DELETE FROM coordination_new.debit_foreclosure WHERE id >= 0;
DELETE FROM coordination_new.refund_property WHERE id >= 0;
DELETE FROM coordination_new.realizations WHERE id >= 0;
DELETE FROM coordination_new.encumbrances WHERE id >= 0;
DELETE FROM coordination_new.evaluations WHERE id >= 0;
DELETE FROM coordination_new.wanteds WHERE id >= 0;
DELETE FROM coordination_new.arrests WHERE id >= 0;
DELETE FROM coordination_new.description_actives WHERE id >= 0;
DELETE FROM coordination_new.actives WHERE id >= 0;
DELETE FROM coordination_new.resolutions WHERE id >= 0;
DELETE FROM coordination_new.interactions WHERE id >= 0;
DELETE FROM coordination_new.clients WHERE id >= 0;
DELETE FROM coordination_new.history WHERE id >= 0;
DELETE FROM coordination_new.users WHERE id >= 0;
DELETE FROM coordination_new.client_categories WHERE id >= 0;
DELETE FROM coordination_new.tno WHERE id >= 0;
DELETE FROM coordination_new.sosp WHERE id >= 0;
DELETE FROM coordination_new.regions WHERE id >= 0;
DELETE FROM coordination_new.library WHERE id >= 0;
DELETE FROM coordination_new.settings WHERE id >= 0;


ALTER TABLE coordination_new.settings AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.library AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.regions AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.sosp AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.tno AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.client_categories AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.users AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.history AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.clients AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.interactions AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.resolutions AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.actives AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.description_actives AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.arrests AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.wanteds AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.evaluations AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.encumbrances AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.realizations AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.refund_property AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.debit_foreclosure AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.active_registrations AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.complaints AUTO_INCREMENT = 1;



INSERT INTO coordination_new.settings (serviceMode) VALUE (False);


INSERT INTO coordination_new.library
SELECT * FROM coordination.library;


INSERT INTO coordination_new.regions (regionCode, regionName, sonoName)
SELECT
    regionCode,
    regionName,
    sonoName
FROM coordination.regions
ORDER BY regionCode;


INSERT INTO coordination_new.sosp (CodeSOSP)
SELECT
    DISTINCT coordination.meta.sosp_code AS code
FROM coordination.meta
WHERE
    coordination.meta.sosp_code IS NOT NULL
  AND
    coordination.meta.sosp_code <> 'null'
ORDER BY code;


INSERT INTO coordination_new.tno (CodeTNO, regionId)
SELECT
    DISTINCT coordination.meta.kno AS code,
             coordination_new.regions.id AS rID
FROM coordination.meta
         LEFT JOIN coordination_new.regions ON coordination.meta.region COLLATE utf8mb4_general_ci = coordination_new.regions.regionCode
HAVING
    coordination_new.regions.id IS NOT NULL
ORDER BY code, rID;


INSERT INTO coordination_new.client_categories (category)
SELECT
    coordination.debt_type.debt_type
FROM coordination.debt_type
ORDER BY coordination.debt_type.debt_type;


INSERT INTO coordination_new.users (role, login, passwordHash, firstName, lastName, secondName, regoinId)
SELECT
    CASE
        WHEN coordination.users.role = 'user'  THEN 'USER'
        WHEN coordination.users.role = 'admin' THEN 'ADMIN'
        WHEN coordination.users.role = 'limited_admin' THEN 'LIMITED_ADMIN'
        WHEN (coordination.users.role = 'gmu_limited_admin') OR (coordination.users.role = 'gmu_arkhangelsk_admin') THEN 'LIMITED_ADMIN_GMU'
        END,
    coordination.users.username,
    coordination.users.password,
    coordination.users.name,
    coordination.users.surname,
    coordination.users.patronymic,
    coordination_new.regions.id
FROM coordination.users
         LEFT JOIN coordination_new.regions ON coordination.users.region COLLATE utf8mb4_general_ci = coordination_new.regions.regionCode
ORDER BY coordination.users.username;


INSERT INTO coordination_new.clients (inn, name, isVisible, categoryId, tnoId, sospId)
SELECT
    coordination.meta.inn,
    coordination.meta.name,
    1,
    cat.newId,
    regoinTNO.id,
    coordination_new.sosp.id
FROM coordination.meta
         LEFT JOIN (
    SELECT
        coordination.debt_type.id AS oldId,
        coordination_new.client_categories.id AS newId
    FROM coordination_new.client_categories
             LEFT JOIN coordination.debt_type ON coordination.debt_type.debt_type COLLATE utf8mb4_general_ci = coordination_new.client_categories.category
) AS cat ON coordination.meta.debt_type = cat.oldId
         LEFT JOIN (
    SELECT
        coordination_new.tno.id AS id,
        coordination_new.tno.CodeTNO AS CodeTNO,
        coordination_new.regions.regionCode AS regionCode
    FROM coordination_new.tno
             LEFT JOIN coordination_new.regions ON coordination_new.tno.regionId = coordination_new.regions.id
) AS regoinTNO ON ((coordination.meta.region COLLATE utf8mb4_general_ci = regoinTNO.regionCode) AND (coordination.meta.kno COLLATE utf8mb4_general_ci = regoinTNO.CodeTNO))
         LEFT JOIN coordination_new.sosp ON coordination.meta.sosp_code COLLATE utf8mb4_general_ci = coordination_new.sosp.CodeSOSP
UNION ALL
SELECT
    result.inn,
    NULL,
    0,
    NULL,
    NULL,
    NULL
FROM (
         SELECT DISTINCT coordination.resolutions.inn FROM coordination.resolutions
         UNION
         SELECT DISTINCT coordination.transport.inn FROM coordination.transport
         UNION
         SELECT DISTINCT coordination.property.inn FROM coordination.property
         UNION
         SELECT DISTINCT coordination.debit.inn FROM coordination.debit
         UNION
         SELECT DISTINCT coordination.another.inn FROM coordination.another
     ) result
WHERE
    result.inn COLLATE utf8mb4_general_ci NOT IN (SELECT inn FROM coordination.meta)
ORDER BY 3 DESC, 1;


INSERT INTO coordination_new.interactions (
    type,
    submissionDate,
    reviewDate,
    result,
    note,
    originalFilename_1,
    originalFilename_2,
    systemsFilename_1,
    systemsFilename_2,
    tnoId,
    clientId
)
SELECT
    coordination.interactions.source AS type,
    coordination.interactions.submissionDate,
    coordination.interactions.reviewDate,
    coordination.interactions.result,
    coordination.interactions.note,
    coordination.interactions.originalFilename_1,
    coordination.interactions.originalFilename_2,
    coordination.interactions.systemsFilename_1,
    coordination.interactions.systemsFilename_2,
    coordination_new.tno.id,
    coordination_new.clients.id AS clientId
FROM coordination.interactions
         LEFT JOIN coordination_new.tno ON coordination.interactions.kno COLLATE utf8mb4_general_ci = coordination_new.tno.CodeTNO
         LEFT JOIN coordination_new.clients ON coordination.interactions.inn COLLATE utf8mb4_general_ci = coordination_new.clients.inn
ORDER BY clientId, type;


INSERT INTO coordination_new.resolutions (
    number,
    date,
    amount,
    balance,
    WritExecutionNumber,
    WritExecutionBeginDate,
    WritExecutionStopDate,
    WritExecutionEndDate,
    WritExecutionEndReason,
    WritExecutionPostponementDate,
    WritExecutionTerminateDate,
    isArchived,
    isDerived,
    clientId
)
SELECT
    coordination.resolutions.post_number AS number,
    coordination.resolutions.post_date AS date,
    coordination.resolutions.post_sum,
    coordination.resolutions.cur_debt,
    coordination.resolutions.exec_number,
    coordination.resolutions.exec_date,
    coordination.resolutions.stop_date,
    coordination.resolutions.end_date,
    coordination.resolutions.end_reason,
    coordination.resolutions.pending_date,
    coordination.resolutions.terminate_date,
    coordination.resolutions.is_archive,
    coordination.resolutions.is_derivative_debt,
    coordination_new.clients.id AS clientId
FROM coordination.resolutions
    RIGHT JOIN coordination_new.clients ON coordination.resolutions.inn COLLATE utf8mb4_general_ci = coordination_new.clients.inn
ORDER BY clientId, number, date;


DROP TABLE IF EXISTS coordination_new.temp_active_mapping;

CREATE TABLE coordination_new.temp_active_mapping (
                                                      activeId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                                                      clientId INT NOT NULL,
                                                      oldActiveId INT NOT NULL,
                                                      type enum('TRANSPORT', 'PROPERTY', 'GROUND', 'DEBIT', 'OTHER') NOT NULL
);


INSERT INTO coordination_new.temp_active_mapping (clientId, oldActiveId, type)
SELECT
    coordination_new.clients.id,
    result.id,
    result.type
FROM (
         SELECT
             coordination.transport.id AS id,
             coordination.transport.inn AS inn,
             'TRANSPORT' AS type
         FROM coordination.transport
         UNION ALL
         SELECT
             coordination.property.id AS id,
             coordination.property.inn AS inn,
             IF(coordination.property.type_id = 2, 'PROPERTY', 'GROUND') AS type
         FROM coordination.property
         UNION ALL
         SELECT
             coordination.debit.id AS id,
             coordination.debit.inn AS inn,
             'DEBIT' AS type
         FROM coordination.debit
         UNION ALL
         SELECT
             coordination.another.id AS id,
             coordination.another.inn AS inn,
             'OTHER' AS type
         FROM coordination.another
     ) AS result
         LEFT JOIN coordination_new.clients ON result.inn COLLATE utf8mb4_general_ci = coordination_new.clients.inn
ORDER BY coordination_new.clients.id, result.type;


SET sql_mode = (SELECT REPLACE(@@sql_mode, 'NO_ZERO_DATE', ''));

INSERT INTO coordination_new.actives (
    id,
    type,
    status,
    objectStatus,
    otherObjectStatus,
    isVerified,
    nameLessor,
    isLeasing,
    comment,
    uploadDate,
    clientId
)
SELECT
    temp.activeId,
    temp.type,
    CASE
        WHEN result.status = 0 THEN 'AIS'
        WHEN result.status = 1 THEN 'OLD_DATA'
        WHEN result.status = 2 THEN 'GMU'
        WHEN result.status = 3 THEN 'AIS_GMU'
        END,
    IF(result.obj_status = 'other', 'OTHER', NULL),
    result.obj_status_manual,
    result.is_verified,
    result.lizing_name,
    CASE
        WHEN result.is_fns_lizing = 0 THEN 'NO_PLEDGE'
        WHEN result.is_fns_lizing = 1 THEN 'IS_PLEDGE_HOLDER'
        WHEN result.is_fns_lizing = 2 THEN 'IS_NOT_PLEDGE_HOLDER'
        END,
    result.comment,
    NULLIF(result.load_date, '0000-00-00'),
    temp.clientId
FROM (
         SELECT
             t.id, 'TRANSPORT' AS type,
             t.status, t.obj_status, t.obj_status_manual, t.is_verified, t.lizing_name, t.is_fns_lizing, t.comment, t.load_date
         FROM coordination.transport t
         UNION ALL
         SELECT
             t.id, IF(t.type_id = 2, 'PROPERTY', 'GROUND') AS type,
             t.status, t.obj_status, t.obj_status_manual, t.is_verified, t.lizing_name, t.is_fns_lizing, t.comment, t.load_date
         FROM coordination.property t
         UNION ALL
         SELECT
             t.id, 'DEBIT' AS type,
             t.status, t.obj_status, t.obj_status_manual, t.is_verified, t.lizing_name, t.is_fns_lizing, t.comment, t.load_date
         FROM coordination.debit t
         UNION ALL
         SELECT
             t.id, 'OTHER' AS type,
             t.status, t.obj_status, t.obj_status_manual, t.is_verified, t.lizing_name, t.is_fns_lizing, t.comment, t.load_date
         FROM coordination.another t
     ) AS result
         LEFT JOIN coordination_new.temp_active_mapping temp ON ((result.type = temp.type) AND (result.id = temp.oldActiveId))
ORDER BY temp.activeId;


INSERT INTO coordination_new.description_actives
SELECT
    temp.activeId,
    result.f1,
    result.f2,
    result.f3,
    result.f4,
    result.f5,
    CAST(REPLACE(NULLIF(result.f6, ''), ',', '.') AS FLOAT),
    result.f7,
    result.f8,
    result.f9,
    REGEXP_REPLACE(result.f10, '[[:space:]]', ''),
    result.f11,
    result.f12
FROM (
         SELECT
             t.id, 'TRANSPORT' AS type,
             t.name AS f1, t.cost AS f2, t.vin AS f3, t.state_number AS f4, t.year AS f5, NULL AS f6, NULL AS f7, NULL AS f8, NULL AS f9, NULL AS f10, NULL AS f11, NULL AS f12
         FROM coordination.transport t
         UNION ALL
         SELECT
             t.id, IF(t.type_id = 2, 'PROPERTY', 'GROUND') AS type,
             t.name AS f1, t.cost AS f2, NULL AS f3, NULL AS f4, NULL AS f5, t.square AS f6, t.cadastral_number AS f7, t.address AS f8, t.share_size AS f9, NULL AS f10, NULL AS f11, NULL AS f12
         FROM coordination.property t
         UNION ALL
         SELECT
             t.id, 'DEBIT' AS type,
             t.debitor_names AS f1, t.total_sum AS f2, NULL AS f3, NULL AS f4, NULL AS f5, NULL AS f6, NULL AS f7, NULL AS f8, NULL AS f9, t.debitor_inn AS f10, t.debitor_address AS f11, t.date AS f12
         FROM coordination.debit t
         UNION ALL
         SELECT
             t.id, 'OTHER' AS type,
             t.name AS f1, t.cost AS f2, NULL AS f3, NULL AS f4, NULL AS f5, NULL AS f6, NULL AS f7, NULL AS f8, NULL AS f9, NULL AS f10, NULL AS f11, NULL AS f12
         FROM coordination.another t
     ) AS result
         LEFT JOIN coordination_new.temp_active_mapping temp ON ((result.type = temp.type) AND (result.id = temp.oldActiveId))
ORDER BY temp.activeId;


INSERT INTO coordination_new.arrests (beginDate, endDate, endReason, amount, activeId)
SELECT
    result.arrest_propperty AS beginDate,
    result.arrest_end_date AS endDate,
    result.arrest_end_cause AS endReason,
    result.arrest_sum AS amount,
    temp.activeId
FROM (
         SELECT
             t.id, 'TRANSPORT' AS type,
             t.arrest_propperty, t.arrest_end_date, t.arrest_end_cause, t.arrest_sum
         FROM coordination.transport t
         UNION ALL
         SELECT
             t.id, IF(t.type_id = 2, 'PROPERTY', 'GROUND') AS type,
             t.arrest_propperty, t.arrest_end_date, t.arrest_end_cause, t.arrest_sum
         FROM coordination.property t
         UNION ALL
         SELECT
             t.id, 'DEBIT' AS type,
             t.arrest_propperty, t.arrest_end_date, t.arrest_end_cause, t.arrest_sum
         FROM coordination.debit t
         UNION ALL
         SELECT
             t.id, 'OTHER' AS type,
             t.arrest_propperty, t.arrest_end_date, t.arrest_end_cause, t.arrest_sum
         FROM coordination.another t
     ) AS result
         LEFT JOIN coordination_new.temp_active_mapping temp ON ((result.type = temp.type) AND (result.id = temp.oldActiveId))
HAVING
    beginDate IS NOT NULL
    OR
    endDate IS NOT NULL
    OR
    endReason IS NOT NULL
    OR
    amount IS NOT NULL
ORDER BY temp.activeId, beginDate;


INSERT INTO coordination_new.wanteds (beginDate, endDate, result, activeId)
SELECT
    result.wanted_open AS beginDate,
    result.wanted_close AS endDate,
    CASE
        WHEN result.wanted_result = '1' THEN 'FINDING_PROPERTY'
        WHEN result.wanted_result = 'Не установлено' THEN 'END_PROPERTY_SEARCH_ACTIVITIES'
        WHEN result.wanted_result = '0' THEN 'END_PROPERTY_SEARCH_ACTIVITIES'
        END AS resultWanted,
    temp.activeId
FROM (
         SELECT
             t.id, 'TRANSPORT' AS type,
             t.wanted_open, t.wanted_close, t.wanted_result
         FROM coordination.transport t
         UNION ALL
         SELECT
             t.id, IF(t.type_id = 2, 'PROPERTY', 'GROUND') AS type,
             t.wanted_open, t.wanted_close, t.wanted_result
         FROM coordination.property t
         UNION ALL
         SELECT
             t.id, 'DEBIT' AS type,
             t.wanted_open, t.wanted_close, t.wanted_result
         FROM coordination.debit t
         UNION ALL
         SELECT
             t.id, 'OTHER' AS type,
             t.wanted_open, t.wanted_close, t.wanted_result
         FROM coordination.another t
     ) AS result
         LEFT JOIN coordination_new.temp_active_mapping temp ON ((result.type = temp.type) AND (result.id = temp.oldActiveId))
HAVING
    beginDate IS NOT NULL
    OR
    endDate IS NOT NULL
    OR
    resultWanted IS NOT NULL
ORDER BY temp.activeId, beginDate;


INSERT INTO coordination_new.evaluations (beginDate, endDate, amount, activeId)
SELECT
    result.evaluation_submit AS beginDate,
    result.evaluation_accept AS endDate,
    result.evaluation_sum AS amount,
    temp.activeId
FROM (
         SELECT
             t.id, 'TRANSPORT' AS type,
             t.evaluation_submit, t.evaluation_accept, t.evaluation_sum
         FROM coordination.transport t
         UNION ALL
         SELECT
             t.id, IF(t.type_id = 2, 'PROPERTY', 'GROUND') AS type,
             t.evaluation_submit, t.evaluation_accept, t.evaluation_sum
         FROM coordination.property t
         UNION ALL
         SELECT
             t.id, 'DEBIT' AS type,
             t.evaluation_submit, t.evaluation_accept, t.evaluation_sum
         FROM coordination.debit t
         UNION ALL
         SELECT
             t.id, 'OTHER' AS type,
             t.evaluation_submit, t.evaluation_accept, t.evaluation_sum
         FROM coordination.another t
     ) AS result
         LEFT JOIN coordination_new.temp_active_mapping temp ON ((result.type = temp.type) AND (result.id = temp.oldActiveId))
HAVING
    beginDate IS NOT NULL
    OR
    endDate IS NOT NULL
    OR
    amount IS NOT NULL
ORDER BY temp.activeId, beginDate;


INSERT INTO coordination_new.encumbrances (type, date, activeId)
SELECT
    NULLIF(result.encumbrance_type, '') AS type,
    result.encumbrance_date AS date,
    temp.activeId
FROM (
    SELECT
    t.id, 'TRANSPORT' AS type,
    t.encumbrance_type, t.encumbrance_date
    FROM coordination.transport t
    UNION ALL
    SELECT
    t.id, IF(t.type_id = 2, 'PROPERTY', 'GROUND') AS type,
    t.encumbrance_type, t.encumbrance_date
    FROM coordination.property t
    UNION ALL
    SELECT
    t.id, 'DEBIT' AS type,
    t.encumbrance_type, t.encumbrance_date
    FROM coordination.debit t
    UNION ALL
    SELECT
    t.id, 'OTHER' AS type,
    t.encumbrance_type, t.encumbrance_date
    FROM coordination.another t
    ) AS result
    LEFT JOIN coordination_new.temp_active_mapping temp ON ((result.type = temp.type) AND (result.id = temp.oldActiveId))
HAVING
    type IS NOT NULL
    OR
    date IS NOT NULL
ORDER BY temp.activeId, date;


DROP TABLE IF EXISTS coordination_new.temp_realizations;
CREATE TABLE coordination_new.temp_realizations LIKE coordination_new.realizations;

INSERT INTO coordination_new.temp_realizations (stage, submitDate, submitAmount, realizationDate, realizationResultDate, realizedPropertyAmount, notificationNotRealizationDate, notRealizationReason, activeId)
    (
        SELECT
            'FIRST' AS stage,
            result.realization_submit AS submitDate,
            result.realization_property_sum AS submitAmount,
            result.realization_date_1 AS realizationDate,
            result.realization_result_1 AS realizationResultDate,
            result.realization_sum_1 AS realizedPropertyAmount,
            result.not_realization_notification AS notificationNotRealizationDate,
            result.realisation1_failure_reason AS notRealizationReason,
            temp.activeId
        FROM (
                 SELECT
                     t.id, 'TRANSPORT' AS type,
                     t.realization_submit, t.realization_property_sum, t.realization_date_1, t.realization_result_1, t.realization_sum_1, t.not_realization_notification, t.realisation1_failure_reason
                 FROM coordination.transport t
                 UNION ALL
                 SELECT
                     t.id, IF(t.type_id = 2, 'PROPERTY', 'GROUND') AS type,
                     t.realization_submit, t.realization_property_sum, t.realization_date_1, t.realization_result_1, t.realization_sum_1, t.not_realization_notification, t.realisation1_failure_reason
                 FROM coordination.property t
                 UNION ALL
                 SELECT
                     t.id, 'DEBIT' AS type,
                     t.realization_submit, t.realization_property_sum, t.realization_date_1, t.realization_result_1, t.realization_sum_1, t.not_realization_notification, t.realisation1_failure_reason
                 FROM coordination.debit t
                 UNION ALL
                 SELECT
                     t.id, 'OTHER' AS type,
                     t.realization_submit, t.realization_property_sum, t.realization_date_1, t.realization_result_1, t.realization_sum_1, t.not_realization_notification, t.realisation1_failure_reason
                 FROM coordination.another t
             ) AS result
                 LEFT JOIN coordination_new.temp_active_mapping AS temp ON ((result.type = temp.type) AND (result.id = temp.oldActiveId))
    )
UNION ALL
(
    SELECT
        'SECOND' AS stage,
        result.price_reduction_resolution AS submitDate,
        result.price_reduction_sum AS submitAmount,
        result.realization_date_2 AS realizationDate,
        result.realization_result_2 AS realizationResultDate,
        result.realization_sum_2 AS realizedPropertyAmount,
        result.not_realization_notification_2 AS notificationNotRealizationDate,
        result.realisation2_failure_reason AS notRealizationReason,
        temp.activeId
    FROM (
             SELECT
                 t.id, 'TRANSPORT' AS type,
                 t.price_reduction_resolution, t.price_reduction_sum, t.realization_date_2, t.realization_result_2, t.realization_sum_2, t.not_realization_notification_2, t.realisation2_failure_reason
             FROM coordination.transport t
             UNION ALL
             SELECT
                 t.id, IF(t.type_id = 2, 'PROPERTY', 'GROUND') AS type,
                 t.price_reduction_resolution, t.price_reduction_sum, t.realization_date_2, t.realization_result_2, t.realization_sum_2, t.not_realization_notification_2, t.realisation2_failure_reason
             FROM coordination.property t
             UNION ALL
             SELECT
                 t.id, 'DEBIT' AS type,
                 t.price_reduction_resolution, t.price_reduction_sum, t.realization_date_2, t.realization_result_2, t.realization_sum_2, t.not_realization_notification_2, t.realisation2_failure_reason
             FROM coordination.debit t
             UNION ALL
             SELECT
                 t.id, 'OTHER' AS type,
                 t.price_reduction_resolution, t.price_reduction_sum, t.realization_date_2, t.realization_result_2, t.realization_sum_2, t.not_realization_notification_2, t.realisation2_failure_reason
             FROM coordination.another t
         ) AS result
             LEFT JOIN coordination_new.temp_active_mapping AS temp ON ((result.type = temp.type) AND (result.id = temp.oldActiveId))
);

INSERT INTO coordination_new.realizations
SELECT *
FROM coordination_new.temp_realizations t
HAVING
    submitDate IS NOT NULL
    OR
    submitAmount IS NOT NULL
    OR
    realizationDate IS NOT NULL
    OR
    realizationResultDate IS NOT NULL
    OR
    realizedPropertyAmount IS NOT NULL
    OR
    notificationNotRealizationDate IS NOT NULL
    OR
    notRealizationReason IS NOT NULL
ORDER BY activeId, stage;

DROP TABLE IF EXISTS coordination_new.temp_realizations;


INSERT INTO coordination_new.refund_property (date, amount, activeId)
SELECT
    result.property_to_debtor_act AS date,
    result.property_to_debtor_sum AS amount,
    temp.activeId
FROM (
    SELECT
    t.id, 'TRANSPORT' AS type,
    t.property_to_debtor_act, t.property_to_debtor_sum
    FROM coordination.transport t
    UNION ALL
    SELECT
    t.id, IF(t.type_id = 2, 'PROPERTY', 'GROUND') AS type,
    t.property_to_debtor_act, t.property_to_debtor_sum
    FROM coordination.property t
    UNION ALL
    SELECT
    t.id, 'DEBIT' AS type,
    t.property_to_debtor_act, t.property_to_debtor_sum
    FROM coordination.debit t
    UNION ALL
    SELECT
    t.id, 'OTHER' AS type,
    t.property_to_debtor_act, t.property_to_debtor_sum
    FROM coordination.another t
    ) AS result
    LEFT JOIN coordination_new.temp_active_mapping temp ON ((result.type = temp.type) AND (result.id = temp.oldActiveId))
HAVING
    date IS NOT NULL
    OR
    amount IS NOT NULL
ORDER BY temp.activeId, date;



INSERT INTO coordination_new.debit_foreclosure (requestDate, requestAmount, cancelDate, cancelReason, activeId)
SELECT
    t.dz_foreclose_date AS requestDate,
    t.dz_foreclose_sum AS requestAmount,
    t.dz_cancel_foreclose_date AS cancelDate,
    t.dz_cancel_foreclose_sum AS cancelReason,
    temp.activeId
FROM coordination.debit t
         LEFT JOIN coordination_new.temp_active_mapping temp ON ((temp.type = 'DEBIT') AND (temp.oldActiveId = t.id))
HAVING
    requestDate IS NOT NULL
    OR
    requestAmount IS NOT NULL
    OR
    cancelDate IS NOT NULL
    OR
    cancelReason IS NOT NULL
ORDER BY temp.activeId, requestDate;


INSERT INTO coordination_new.active_registrations (beginDate, endDate, activeId)
SELECT
    result.beginDate,
    result.endDate,
    temp.activeId
FROM (
         SELECT
             t.id, 'TRANSPORT' AS type,
             IF(MONTH(t.registration_start_date) > 0, t.registration_start_date, NULL) AS beginDate,
             IF(MONTH(t.registration_end_date) > 0, t.registration_end_date, NULL) AS endDate
         FROM coordination.transport t
         UNION ALL
         SELECT
             t.id, IF(t.type_id = 2, 'PROPERTY', 'GROUND') AS type,
             IF(MONTH(t.registration_start_date) > 0, t.registration_start_date, NULL) AS beginDate,
             IF(MONTH(t.registration_end_date) > 0, t.registration_end_date, NULL) AS endDate
         FROM coordination.property t
     ) AS result
         LEFT JOIN coordination_new.temp_active_mapping temp ON ((result.type = temp.type) AND (result.id = temp.oldActiveId))
HAVING
    beginDate IS NOT NULL
    OR
    endDate IS NOT NULL
ORDER BY temp.activeId, beginDate, endDate;


INSERT INTO coordination_new.complaints (personWhoFiled, date, subject, source, result, activeId)
SELECT
    result.person_filed_complaint AS personWhoFiled,
    result.complaint_date AS date,
    result.complaint_subject AS subject,
    result.complaint_source AS source,
    result.complaint_result AS resultComplint,
    temp.activeId
FROM (
    SELECT
    t.id, 'TRANSPORT' AS type,
    t.person_filed_complaint, t.complaint_date, t.complaint_subject, t.complaint_source, t.complaint_result
    FROM coordination.transport t
    UNION ALL
    SELECT
    t.id, IF(t.type_id = 2, 'PROPERTY', 'GROUND') AS type,
    t.person_filed_complaint, t.complaint_date, t.complaint_subject, t.complaint_source, t.complaint_result
    FROM coordination.property t
    UNION ALL
    SELECT
    t.id, 'DEBIT' AS type,
    t.person_filed_complaint, t.complaint_date, t.complaint_subject, t.complaint_source, t.complaint_result
    FROM coordination.debit t
    UNION ALL
    SELECT
    t.id, 'OTHER' AS type,
    t.person_filed_complaint, t.complaint_date, t.complaint_subject, t.complaint_source, t.complaint_result
    FROM coordination.another t
    ) AS result
    LEFT JOIN coordination_new.temp_active_mapping temp ON ((result.type = temp.type) AND (result.id = temp.oldActiveId))
HAVING
    personWhoFiled IS NOT NULL
    OR
    date IS NOT NULL
    OR
    subject IS NOT NULL
    OR
    source IS NOT NULL
    OR
    resultComplint IS NOT NULL
ORDER BY temp.activeId, date;


DROP TABLE IF EXISTS coordination_new.temp_active_mapping;