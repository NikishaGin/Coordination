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
DELETE FROM coordination_new.debtor_persons WHERE id >= 0;
DELETE FROM coordination_new.history WHERE id >= 0;
DELETE FROM coordination_new.users WHERE id >= 0;
DELETE FROM coordination_new.debtor_categories WHERE id >= 0;
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
ALTER TABLE coordination_new.debtor_categories AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.users AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.history AUTO_INCREMENT = 1;
ALTER TABLE coordination_new.debtor_persons AUTO_INCREMENT = 1;
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


INSERT INTO coordination_new.debtor_categories (category)
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


INSERT INTO coordination_new.debtor_persons (inn, name, isVisible, categoryId, tnoId, sospId)
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
        coordination_new.debtor_categories.id AS newId
    FROM coordination_new.debtor_categories
    LEFT JOIN coordination.debt_type ON coordination.debt_type.debt_type COLLATE utf8mb4_general_ci = coordination_new.debtor_categories.category
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
    DISTINCT result.inn,
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
                                           personId
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
    coordination_new.debtor_persons.id AS personId
FROM coordination.interactions
LEFT JOIN coordination_new.tno ON coordination.interactions.kno COLLATE utf8mb4_general_ci = coordination_new.tno.CodeTNO
LEFT JOIN coordination_new.debtor_persons ON coordination.interactions.inn COLLATE utf8mb4_general_ci = coordination_new.debtor_persons.inn
ORDER BY personId, type;


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
                                          personId
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
    coordination_new.debtor_persons.id AS personId
FROM coordination.resolutions
RIGHT JOIN coordination_new.debtor_persons ON coordination.resolutions.inn COLLATE utf8mb4_general_ci = coordination_new.debtor_persons.inn
ORDER BY personId, number, date;


DROP TABLE IF EXISTS coordination_new.temp_active_mapping;

CREATE TABLE coordination_new.temp_active_mapping (
    activeId INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    personId INT NOT NULL,
    oldActiveId INT NOT NULL,
    type enum('TRANSPORT', 'PROPERTY', 'GROUND', 'DEBIT', 'OTHER') NOT NULL
);


INSERT INTO coordination_new.temp_active_mapping (personId, oldActiveId, type)
SELECT
    coordination_new.debtor_persons.id,
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
LEFT JOIN coordination_new.debtor_persons ON result.inn COLLATE utf8mb4_general_ci = coordination_new.debtor_persons.inn
ORDER BY coordination_new.debtor_persons.id, result.type;


SET sql_mode = (SELECT REPLACE(@@sql_mode, 'NO_ZERO_DATE', ''));

INSERT INTO coordination_new.actives
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
    IF(result.load_date = '0000-00-00', NULL, result.load_date),
    temp.personId
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
    CAST(REPLACE(IF(result.f6 = '', NULL, result.f6), ',', '.') AS FLOAT),
    result.f7,
    result.f8,
    result.f9,
    result.f10,
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
    result.arrest_propperty,
    result.arrest_end_date,
    result.arrest_end_cause,
    result.arrest_sum,
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
WHERE
    result.arrest_propperty IS NOT NULL
   OR
    result.arrest_end_date IS NOT NULL
   OR
    result.arrest_end_cause IS NOT NULL
   OR
    result.arrest_sum IS NOT NULL
ORDER BY temp.activeId, result.arrest_propperty;


INSERT INTO coordination_new.wanteds (beginDate, endDate, result, activeId)
SELECT
    result.wanted_open,
    result.wanted_close,
    CASE
        WHEN result.wanted_result = '1' THEN 'FINDING_PROPERTY'
        WHEN result.wanted_result = 'Не установлено' THEN 'END_PROPERTY_SEARCH_ACTIVITIES'
        WHEN result.wanted_result = '0' THEN 'END_PROPERTY_SEARCH_ACTIVITIES'
    END,
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
WHERE
    result.wanted_open IS NOT NULL
    OR
    result.wanted_close IS NOT NULL
    OR
    result.wanted_result IS NOT NULL
ORDER BY temp.activeId, result.wanted_open;


INSERT INTO coordination_new.evaluations (beginDate, endDate, amount, activeId)
SELECT
    result.evaluation_submit,
    result.evaluation_accept,
    result.evaluation_sum,
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
WHERE
    result.evaluation_submit IS NOT NULL
    OR
    result.evaluation_accept IS NOT NULL
    OR
    result.evaluation_sum IS NOT NULL
ORDER BY temp.activeId, result.evaluation_submit;


INSERT INTO coordination_new.encumbrances (type, date, activeId)
SELECT
    result.encumbrance_type,
    result.encumbrance_date,
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
WHERE
    result.encumbrance_type IS NOT NULL
    OR
    result.encumbrance_date IS NOT NULL
ORDER BY temp.activeId, result.encumbrance_date;


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
WHERE
    t.submitDate IS NOT NULL
    OR
    t.submitAmount IS NOT NULL
    OR
    t.realizationDate IS NOT NULL
    OR
    t.realizationResultDate IS NOT NULL
    OR
    t.realizedPropertyAmount IS NOT NULL
    OR
    t.notificationNotRealizationDate IS NOT NULL
    OR
    t.notRealizationReason IS NOT NULL
ORDER BY t.activeId, t.stage;

DROP TABLE IF EXISTS coordination_new.temp_realizations;


INSERT INTO coordination_new.refund_property (date, amount, activeId)
SELECT
    result.property_to_debtor_act,
    result.property_to_debtor_sum,
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
WHERE
    result.property_to_debtor_act IS NOT NULL
   OR
    result.property_to_debtor_sum IS NOT NULL
ORDER BY temp.activeId, result.property_to_debtor_act;


/*
INSERT INTO coordination_new.debit_foreclosure (requestDate, requestAmount, cancelDate, cancelAmount, activeId)
SELECT
    t.dz_foreclose_date,
    t.dz_foreclose_sum,
    t.dz_cancel_foreclose_date,
    t.dz_cancel_foreclose_sum,
    temp.activeId
FROM coordination.debit t
LEFT JOIN coordination_new.temp_active_mapping temp ON ((temp.type = 'DEBIT') AND (temp.oldActiveId = t.id))
WHERE
    t.dz_foreclose_date IS NOT NULL
    OR
    t.dz_foreclose_sum IS NOT NULL
    OR
    t.dz_cancel_foreclose_date IS NOT NULL
    OR
    t.dz_cancel_foreclose_sum IS NOT NULL
ORDER BY temp.activeId, t.dz_foreclose_date;
 */


/*
INSERT INTO coordination_new.active_registrations (beginDate, endDate, activeId)
SELECT
    result.registration_start_date,
    result.registration_end_date,
    temp.activeId
FROM (
     SELECT
         t.id, 'TRANSPORT' AS type,
         t.registration_start_date, t.registration_end_date
     FROM coordination.transport t
     UNION ALL
     SELECT
         t.id, IF(t.type_id = 2, 'PROPERTY', 'GROUND') AS type,
         t.registration_start_date, t.registration_end_date
     FROM coordination.property t
) AS result
LEFT JOIN coordination_new.temp_active_mapping temp ON ((result.type = temp.type) AND (result.id = temp.oldActiveId))
WHERE
    result.registration_start_date IS NOT NULL
   OR
    result.registration_end_date IS NOT NULL
ORDER BY temp.activeId, result.registration_start_date, result.registration_end_date;
 */


INSERT INTO coordination_new.complaints (personWhoFiled, date, subject, source, result, activeId)
SELECT
    result.person_filed_complaint,
    result.complaint_date,
    result.complaint_subject,
    result.complaint_source,
    result.complaint_result,
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
WHERE
    result.person_filed_complaint IS NOT NULL
    OR
    result.complaint_date IS NOT NULL
    OR
    result.complaint_subject IS NOT NULL
    OR
    result.complaint_source IS NOT NULL
    OR
    result.complaint_result IS NOT NULL
ORDER BY temp.activeId, result.complaint_date;


DROP TABLE IF EXISTS coordination_new.temp_active_mapping;