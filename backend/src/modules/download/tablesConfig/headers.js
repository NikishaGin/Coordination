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
    post_sum: `Сумма всего/сумма ${sourceName} по статье 47 НК РФ`,
    cur_debt: `Сумма всего/текущий остаток ${sourceName} по статье 47 НК РФ`,
})


const ACTIVES_COMMON_HEADERS = {
    arrest_sum:           `Арест имущества, ₽`,
    measures_sum:         `Оценка имущества, ₽`,
    realisation_sum_1:    `Результат принудительной реализация 1 этап, ₽`,
    price_reduction_sum:  `Сумма снижения цены, ₽`,
    realisation_sum_2:    `Результат принудительной реализация 2 этап, ₽`,
    return_to_debtor_sum: `Сумма возврата имущества должнику, ₽`,
    debitor_request_sum:  `Сумма по обращениям на взыскания дебиторской задолженности`,
    enforcement_status:   `Статус ИП`,
}


export const headersStatistics = isDerived => {
    const sourceName = getSourceName(isDerived)

    return {
        general: { // По всем активом вместе с дебиторской задолженностью
            ...ID_HEADERS,
            ...GET_SUMS_HEADERRS(sourceName),
            debt_type:   `Категория должника`,
            actives_sum: `Сумма активов и дебиторской задолженности, ₽`,
            ...ACTIVES_COMMON_HEADERS,

        },
        actives: { // По всем активом без дебиторской задолженности
            ...ID_HEADERS,
            actives_sum: `Сумма активов`,
            ...ACTIVES_COMMON_HEADERS
        },
        debit: { // По дебиторской задолженности только
            ...ID_HEADERS,
            actives_sum: `Сумма дебиторской задолженности`,
            ...ACTIVES_COMMON_HEADERS
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
