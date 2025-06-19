import db from '../../../connection.js';

const getSourceName = isDerived =>
    isDerived
        ? "исполнительного листа"
        : "постановления";


const ID_HEADERS = {
    kno:  `Код НО`,
    inn:  `ИНН должника`,
    name: `Наименование должника`,
}


const GET_SUMS_HEADERRS =  sourceName => ({
    post_sum: `Сумма по постановлениям по статье 47 НК РФ`,
    cur_debt: `Остаток по постановлениям по статье 47 НК РФ`,
})


const ACTIVES_COMMON_HEADERS = {
    arrest_sum:               `Арест имущества, ₽`,
    securing_arrest:          `Обеспеченность остатка долга арестом`,
    evaluation_sum:           `Оценка имущества, ₽`,
    realization_sum_1:        `Результат принудительной реализация 1 этап, ₽`,
    // price_reduction_sum:      `Сумма снижения цены, ₽`,
    realization_sum_2:        `Результат принудительной реализация 2 этап, ₽`,
    realization_sum_total:    `Результат принудительной реализация (всего), ₽`,
    property_to_debtor_sum:   `Сумма возврата имущества должнику, ₽`,
}

const DEBIT_SUB = {
    dz_sum: `Сумма по обращениям на взыскания дебиторской задолженности, ₽`,
};


export const headersStatistics = isDerived => {
    const sourceName = getSourceName(isDerived)

    return {
        general: { // По всем активом вместе с дебиторской задолженностью
            ...ID_HEADERS,
            ...GET_SUMS_HEADERRS(sourceName),
            debtor_category:   `Категория должника`,
            actives_sum:       `Сумма активов и дебиторской задолженности, ₽`,
            ...ACTIVES_COMMON_HEADERS,
            ...DEBIT_SUB,
            ip_status:         `Статус ИП`,

        },
        actives: { // По всем активом без дебиторской задолженности
            ...ID_HEADERS,
            actives_sum: `Сумма активов`,
            ...ACTIVES_COMMON_HEADERS
        },
        debit: { // По дебиторской задолженности только
            ...ID_HEADERS,
            actives_sum: `Сумма дебиторской задолженности`,
            ...ACTIVES_COMMON_HEADERS,
            ...DEBIT_SUB,
            dz_close_sum: `Отмена обращения на дебиторскую задоженность`

        },
    };
}


export const headerStatisticsIP = isDerived => {
    const sourceName = getSourceName(isDerived);
    return {
        ...ID_HEADERS,
        post_number: `Номер  ${sourceName} по статье 47 НК РФ`,
        post_date:   `Дата ${sourceName} по статье 47 НК РФ`,
        ...GET_SUMS_HEADERRS(sourceName),
        exec_number: `Номер исполнительного производства/наличие сводного ИП`,
        exec_date:   `Дата возбуждения исполнительного производства`,
        end_date:    `Дата ${sourceName} СПИ об окончании ИП`,
        end_reason:  `Основание окончания (прекращения) исполнительного производства`,
        status_ip:   `Статус ИП`
    }
}

const commonHeaders = {
    region:          "Регион",
    kno:             "Код НО",                     // kno без изменений
    metaName:        "Наименование должника",
    inn:             "ИНН должника",              // inn — в таблицах совпадает
    status:          "Код статуса верификации выгрузки",
    statusName:      "Статус верификации выгрузки",
    load_date:       "Дата добавления/обновления данных",
    debtor_category: "Категория должника",
    dz_sum:          "Сумма всего по постановлениям по статье 47 НК РФ",
    cur_debt:        "Текущий остаток по постановлениям по статье 47 НК РФ",
};

const newFields = {
    arrest_end_date: "Дата снятия ареста",
    arrest_end_cause: "Основания снятия ареста с имущества",
    person_field_complaint: "Лицо подавшее жалобу",
    complaint_date: "Дата жалобы",
    complaint_subject: "Предмет жалобы",
    complaint_source: "Орган рассматривающий жалобу",
    complaint_result: "Результат рассмотрения жалобы",
}

const enforcementHeaders = {
    is_verified:                    "Верифицированы активы ФССП",
    arrest_propperty:               "Арест имущества",
    arrest_sum:                    "Сумма ареста (руб.)",
    arrestStatus:                  "Статус ареста",
    wanted_open:                    "Заведено розыскное дело",
    wanted_close:                   "Прекращено розыскное дело",
    wanted_result:                 "Результат розыска",
    wantedStatus:                  "Статус Разыскного дела",
    evaluation_submit:             "Передано на оценку",
    evaluation_accept:             "Принятие результатов оценки имущества",
    evaluation_sum:                "Сумма оценки (руб.)",
    evaluationStatus:              "Статус оценки",
    realization_submit:            "Передано на реализацию",
    realization_property_sum:      "Сумма переданного имущества на реализацию",
    submitRealizationFirstStageStatus:  "Статус передачи на реализацию",
    realization_date_1:            "Дата первых торгов",
    realization_result_1:          "Отчет о реализации (1 этап)",
    realization_sum_1:             "Сумма реализованного имущества (руб.) (1 этап)",
    not_realization_notification:  "Уведомление о не реализации",
    auction1_failure_reason:       "Причина признания  1 торгов не состоявшимися",
    auction1_status:               "Текущий статус 1 торгов",
    realizationFirstStageStatus:   "Статус реализации 1 этап",
    price_reduction_resolution:    "Постановление о снижении цены",
    price_reduction_sum:           "Сумма снижения цены (руб.)",
    submitRealizationSecondStageStatus: "Статус передачи на реализацию 2 этап",
    realization_date_2:            "Дата вторых торгов",
    realization_result_2:          "Отчет о реализации (2 этап)",
    realization_sum_2:             "Сумма реализованного имущества (руб.) (2 этап)",
    not_realization_notification_2:"Уведомление о нереализации (2 этап)",
    auction2_failure_reason:       "Причина признания  2 торгов не состоявшимися",
    auction2_status:               "Текущий статус 2 торгов",
    realizationSecondStageStatus:  "Статус реализации 2 этап",
    property_to_debtor_act:        "Акт передачи имущества должнику",
    property_to_debtor_sum:        "Сумма возврата имущества должнику",
    // realisationSumTotal:           "Взыскано всего в ходе исполнительного производства (руб.)",
    // proceeding_end_date:           "Дата окончания (прекращения) исполнительного производства",
    // proceeding_end_reason:         "Основание окончания (прекращения) исполнительного производства",
    // proceeding_stop_date:          "Дата приостановления исполнительного производства",
    // proceeding_pending_date:       "Дата отложения исполнительного производства",
    // proceeding_terminate_date:     "Дата прекращения исполнительного производства",
};

const transportHeaders = {
    ...commonHeaders,
    category:       "Вид объекта собственности",      // type_id вместо property_type
    name:           "Марка",                          // brand — название в таблице 'name' - поправь на name ниже
    vin:             "VIN-номер",
    state_number:    "Государственный номер",
    year:            "Год выпуска",
    cost:            "Стоимость",
    obj_status:       "Статус объекта",
    registration_start_date: "Дата регистрации владения",
    registration_end_date: "Дата прекращения владения",
    encumbrance_type: "Вид обременения",
    encumbrance_date: "Дата обременения",
    lizing_name:      "Наименование залогодержателя/лизингодателя", // lizing_name вместо holder_name
    ...enforcementHeaders,
    ...newFields,
    comment: "Примечание"
};

const realEstateHeaders = {
    ...commonHeaders,
    category:          "Вид объекта собственности",   // type_id вместо type
    name:             "Наименование",
    area:             "Площадь",
    cadastral_number:  "Кадастровый номер",
    address:          "Адрес",
    cost:             "Стоимость",
    share:            "Размер доли в праве",
    encumbrance_type:  "Вид обременения",
    encumbrance_date:  "Дата обременения",
    lizing_name:       "Наименование залогодержателя/лизингодателя", // lizing_name вместо holder_name
    ...enforcementHeaders,
    ...newFields,
    comment: "Примечание"
};

const debtorHeaders = {
    ...commonHeaders,
    request_date:                   "Дата ходатайства",
    debtor_name:                   "Наименование дебиторов",
    debtor_inn:                    "ИНН дебиторов",
    request_sum:                   "Сумма по ходатайству",
    ...enforcementHeaders,
    claim_filing:                  "Обращение на взыскание ДЗ",
    claim_filing_sum:              "Сумма обращения на взыскание ДЗ (руб.)",
    claim_filing_status:           "Статус обращения взыскания на ДЗ",
    claim_cancel_resolution:       "Постановление об отмене обращения на взыскания ДЗ",
    claim_cancel_reason:           "Основание отмены  обращения на ДЗ",
    ...newFields,
    comment: "Примечание"
};

const otherAssetsHeaders = {
    ...commonHeaders,
    category:          "Вид объекта собственности",     // type_id вместо property_type
    name:             "Наименование",
    cost:             "Стоимость",
    encumbrance_type: "Вид обременения",
    encumbrance_date: "Дата обременения",
    lizing_name:      "Наименование залогодержателя/лизингодателя", // lizing_name вместо holder_name
    ...enforcementHeaders,
    ...newFields,
    comment: "Примечание"
};

export const activeSheetConfigs = {
    transport: {
        name: "Транспорт",
        headers: transportHeaders,
        withLizing: true,
    },
    property: {
        name: "Недвижимость",
        headers: realEstateHeaders,
        withLizing: true,
    },
    ground: {
        name: "Зем. участ.",
        headers: realEstateHeaders,
        withLizing: true,
    },
    debit: {
        name: "Дебит. задолж.",
        headers: debtorHeaders,
        withLizing: false,
    },
    another: {
        name: "Иные активы",
        headers: otherAssetsHeaders,
        withLizing: true,
    }
};


export const headersActivesStatistics = (lizingKeyPostfix = "") => {
    const headers = {};

    for (const [
        key,
        { headers: baseHeaders, withLizing }
    ] of Object.entries(activeSheetConfigs)) {
        headers[key] = baseHeaders;
        if (withLizing) {
            headers[key + lizingKeyPostfix] = baseHeaders;
        }
    }

    return headers;
};


export const activesSheets = (
    lizingKeyPostfix = "",
    lizingTextPostfix = ""
) => {
    const sheetNames = {};

    for (const [
        key,
        { withLizing, name }
    ] of Object.entries(activeSheetConfigs)) {
        sheetNames[key] = name;

        if (withLizing && lizingKeyPostfix) {
            sheetNames[key + lizingKeyPostfix] = name + lizingTextPostfix;
        }
    }

    return sheetNames;
};

