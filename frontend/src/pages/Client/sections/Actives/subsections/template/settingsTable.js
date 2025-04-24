export const optionsMap = {
    fnsLizing: [
        ["Является", "1"],
        ["Не является", "2"],
        ["Не является, нет залога", "0"]
    ],
    arrest: [
        ["Установлено", "1"],
        ["Не установлено", "0"]
    ],
    verify: [
        ["Да", "1"],
        ["Нет", "0"]
    ],
    status: [
        ["Арест", "arrest"],
        ["Оценка", "grade"],
        ["Реализация", "sale"],
        ["Розыск", "wanted"],
        ["Обжалование в суде испол. действия", "appeal"],
        ["Лизинг (залог иного лица)", "lizing"],
        ["Иное", "other"]
    ]
};



/*    Редактирование наименования есть только в "Иных активах"
[
    "Наименование объекта"
],
*/



const headers = [
    [
        "Наименование",
        "Государственный номер",
        "Стоимость, ₽"
    ],
    [
        "Верифицирован объект",
        "Статус объекта",
        "Иной статус" // при "Статус объекта" = "Иное"
    ],
    [
        "Размер доли в праве",
        "Дата начала регистрации",
        "Дата окончания регистрации"
    ],
    [
        "Арест имущества",
        "Сумма ареста"
    ],
    [
        "Заведение розыскного дела",
        "Прекращение розыскного дела",
        "Результат розыска"
    ],
    [
        "Передана на оценку",
        "Принятие результатов оценки",
        "Сумма оценки"
    ],
    [
        "Передана на реализацию",
        "Сумма переданного имущества",
        "Дата первых торгов",
        "Отчет о реализации"
    ],
    [
        "Сумма реализованного имущества",
        "Уведомление о нереализации (1 этап)",
        "Постановление о снижении цены",
        "Сумма снижения цены"
    ],
    [
        "Сумма реализованного имущества",
        "Уведомление о нереализации (2 этап)",
        "Дата вторых торгов",
        "Отчет о реализации"
    ],
    [
        "Акт передачи имущества должнику",
        "Сумма возврата имущества должнику"
    ],
    [
        "Обращение взыскания на ДЗ",
        "Сумма обращения на взыскание ДЗ",
        "Отмена обращения на взыскание ДЗ",
        "Основание отмены обращения на ДЗ"
    ],
    [
        "Является ли ФНС залогодержателем",
        "Наименование залогодержателя(лизингодателя)",
        "Дата обременения",
        "Вид обременения"   // при "Является ли ФНС залогодержателем" = "Не является"   (is_fns_lizing, 	есть ли залог перед ФНС: 0 - нет залога, 1 залог перед ФНС, 2 - залог не перед ФНС)
    ],
    "Комментарий"
]


const feilds = [
    ["name", "number", "cost"],
    [
        [
            "is_verified",
            "obj_status",
            "obj_status_manual"
        ],
        [
            "share_size",
            "registration_start_date",
            "registration_end_date"
        ],
        [
            "arrest_propperty",
            "arrest_sum"
        ],
        [
            "wanted_open",
            "wanted_close",
            "wanted_result"
        ],
        [
            "evaluation_submit",
            "evaluation_accept",
            "evaluation_sum"
        ],
        [
            "realization_submit",
            "realization_sum",
            "realization_date",
            "realization_report"
        ],
        [
            "realization_property_sum_1",
            "not_realization_notification_1",
            "price_reduction_resolution",
            "price_reduction_sum"
        ],
        [
            "realization_property_sum_2",
            "not_realization_notification_2",
            "date_2",
            "report_2"
        ],
        [
            "property_to_debtor_act",
            "property_to_debtor_sum",
        ],
        [
            "dz_foreclose_date",
            "dz_foreclose_sum",
            "dz_cancel_foreclose_date",
            "dz_cancel_foreclose_sum",
            "debitor_address",
        ],
        [
            "lizing_name",
            "is_fns_lizing",
            "encumbrance_type",
            "encumbrance_date",
        ],
        "comment"
    ]
]



export function getHeadersAndFieldsByActive(nameActive) {
    const filteredHeaders = headers.filter((_, index) => {
        if (index == 2)
            return ["property", "ground"].includes(nameActive)
        else if ([8, 9].includes(index))
            return (nameActive != "another")
        else if (index == 10)
            return nameActive == "debit"
        else
            return true
    })
    const filteredFields = feilds[1].filter((_, index) => {
        if (index == 2)
            return ["property", "ground"].includes(nameActive)
        else if ([8, 9].includes(index))
            return (nameActive != "another")
        else if (index == 10)
            return nameActive == "debit"
        else
            return true
    }).flat()
    return { headers: filteredHeaders, feilds: [feilds[0], filteredFields] }
}