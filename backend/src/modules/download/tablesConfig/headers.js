

export const headerStatisticsIP = isDerived => {
    const sourceName = (isDerived) ? 'исполнительного листа' : 'постановления'
    return {
        kno: `Код НО`,
        inn: `ИНН должника`,
        name: `Наименование должника`,
        post_number: `Номер  ${sourceName}  по статье 47 НК РФ`,
        post_date: `Дата ${sourceName} по статье 47 НК РФ`,
        post_sum: `Сумма всего/сумма ${sourceName} по статье 47 НК РФ`,
        cur_debt: `Сумма всего/текущий остаток ${sourceName} по статье 47 НК РФ`,
        exec_number: `Номер исполнительного производства/наличие сводного ИП`,
        exec_date: `Дата возбуждения исполнительного производства`,
        end_date: `Дата ${sourceName} СПИ об окончании ИП`,
        end_reason: `Основание окончания (прекращения) исполнительного производства`,
        status_ip: `Статус ИП`
    }
}