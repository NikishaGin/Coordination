/*
type: undefined,
type: "text",
type: "textarea",
type: "date",
type: "number",
type: "select", 
*/



export default nameActive => [
    [
        {
            name: "Наименование",
            field: "name",
            type: (nameActive == "another") ? "textarea" : undefined,
            editable: (nameActive == "another"),
            width: "450px"
        },
        ...((["transport", "property", "ground"].includes(nameActive)) ?
            [
                {
                    name: (nameActive == "transport") ? "Государственный номер" : "Кадастровый номер",
                    field: "number",
                    type: "text",
                    editable: false
                }
            ] : []),
        ...((nameActive == "debit") ?
            [
                {
                    name: "Дата ходатайства",
                    field: "date",
                    type: "date",
                    editable: false
                }
            ] : []),
        {
            name: "Стоимость, ₽",
            field: "cost",
            type: "number",
            editable: false
        },
    ],
    [
        {
            name: "Верифицирован объект",
            field: "is_verified",
            type: "select",
            editable: true,
            options: [
                {
                    text: "Да",
                    value: "1"
                },
                {
                    text: "Нет",
                    value: "0"
                }
            ]
        },
        {
            name: "Статус объекта",
            field: "obj_status",
            type: "select",
            editable: true,
            width: "500px",
            options: [
                {
                    text: "Арест",
                    value: "arrest"
                },
                {
                    text: "Оценка",
                    value: "grade"
                },
                {
                    text: "Реализация",
                    value: "sale"
                },
                {
                    text: "Розыск",
                    value: "wanted"
                },
                {
                    text: "Обжалование в суде испол. действия",
                    value: "appeal"
                },
                {
                    text: "Лизинг (залог иного лица)",
                    value: "lizing"
                },
                {
                    text: "Иное",
                    value: "other"
                },
            ]
        },
        {
            name: "Иной статус", // при "Статус объекта" = "Иное"
            field: "obj_status_manual",
            type: "text",
            editable: true,
        }
    ],
    ...(
        (["property", "ground"].includes(nameActive)) ?
            [
                [
                    {
                        name: "Размер доли в праве",
                        field: "share_size",
                        type: "number",
                        editable: true
                    },
                    {
                        name: "Дата начала регистрации",
                        field: "registration_start_date",
                        type: "date",
                        editable: true
                    },
                    {
                        name: "Дата окончания регистрации",
                        field: "registration_end_date",
                        type: "date",
                        editable: true
                    },
                ]
            ] :
            []
    ),
    [
        {
            name: "Арест имущества",
            field: "arrest_propperty",
            type: "date",
            editable: true
        },
        {
            name: "Сумма ареста, ₽",
            field: "arrest_sum",
            type: "number",
            editable: true
        },
    ],
    [
        {
            name: "Заведение розыскного дела",
            field: "wanted_open",
            type: "date",
            editable: true
        },
        {
            name: "Прекращение розыскного дела",
            field: "wanted_close",
            type: "date",
            editable: true
        },
        {
            name: "Результат розыска",
            field: "wanted_result",
            type: "select",
            editable: true,
            options: [
                {
                    text: "Установлено",
                    value: "1"
                },
                {
                    text: "Не установлено",
                    value: "0"
                }
            ]
        },
    ],
    [
        {
            name: "Передана на оценку",
            field: "evaluation_submit",
            type: "date",
            editable: true
        },
        {
            name: "Принятие результатов оценки",
            field: "evaluation_accept",
            type: "date",
            editable: true
        },
        {
            name: "Сумма оценки, ₽",
            field: "evaluation_sum",
            type: "number",
            editable: true
        },
    ],
    [
        {
            name: "Передана на реализацию",
            field: "realization_submit",
            type: "date",
            editable: true
        },
        {
            name: "Сумма переданного имущества, ₽",
            field: "realization_sum_1",
            type: "number",
            editable: true
        },
        {
            name: "Дата первых торгов",
            field: "realization_date_1",
            type: "date",
            editable: true
        },
        {
            name: "Отчет о реализации",
            field: "realization_result_1",
            type: "date",
            editable: true
        },
    ],
    [
        {
            name: "Сумма реализованного имущества, ₽",
            field: "realization_property_sum",
            type: "number",
            editable: true
        },
        {
            name: "Уведомление о нереализации (1 этап)",
            field: "not_realization_notification",
            type: "date",
            editable: true
        },
        {
            name: "Постановление о снижении цены",
            field: "price_reduction_resolution",
            type: "date",
            editable: true
        },
        {
            name: "Сумма снижения цены, ₽",
            field: "price_reduction_sum",
            type: "number",
            editable: true
        },
    ],
    ...((nameActive != "another") ?
        [
            [
                {
                    name: "Сумма реализованного имущества, ₽",
                    field: "realization_sum_2",
                    type: "number",
                    editable: true
                },
                {
                    name: "Уведомление о нереализации (2 этап)",
                    field: "not_realization_notification_2",
                    type: "date",
                    editable: true
                },
                {
                    name: "Дата вторых торгов",
                    field: "realization_date_2",
                    type: "date",
                    editable: true
                },
                {
                    name: "Отчет о реализации",
                    field: "realization_result_2",
                    type: "date",
                    editable: true
                },
            ],
            [
                {
                    name: "Акт передачи имущества должнику",
                    field: "property_to_debtor_act",
                    type: "date",
                    editable: true
                },
                {
                    name: "Сумма возврата имущества должнику, ₽",
                    field: "property_to_debtor_sum",
                    type: "number",
                    editable: true
                },
            ],
        ] : []),
    ...((nameActive == "debit") ?
        [
            [
                {
                    name: "Обращение взыскания на ДЗ",
                    field: "dz_foreclose_date",
                    type: "date",
                    editable: true
                },
                {
                    name: "Сумма обращения на взыскание ДЗ, ₽",
                    field: "dz_foreclose_sum",
                    type: "number",
                    editable: true
                },
                {
                    name: "Отмена обращения на взыскание ДЗ",
                    field: "dz_cancel_foreclose_date",
                    type: "date",
                    editable: true
                },
                {
                    name: "Основание отмены обращения на ДЗ, ₽",
                    field: "dz_cancel_foreclose_sum",
                    type: "number",
                    editable: true
                },
                {
                    name: "Адрес дебитора",
                    field: "debitor_address",
                    type: "textarea",
                    editable: true
                }
            ],
        ] : []),
    [
        {
            name: "Является ли ФНС залогодержателем",
            field: "is_fns_lizing",
            type: "select",
            editable: true,
            options: [
                {
                    text: "Является",
                    value: "1"
                },
                {
                    text: "Не является",
                    value: "2"
                },
                {
                    text: "Не является, нет залога",
                    value: "0"
                }
            ]     //   (is_fns_lizing, 	есть ли залог перед ФНС: 0 - нет залога, 1 залог перед ФНС, 2 - залог не перед ФНС)
        },
        {
            name: "Наименование залогодержателя (лизингодателя)",
            field: "lizing_name",
            type: "textarea",
            editable: true
        },
        {
            name: "Дата обременения",
            field: "encumbrance_date",
            type: "date",
            editable: true
        },
        {
            name: "Вид обременения",   // при "Является ли ФНС залогодержателем" = "Не является"
            field: "encumbrance_type",
            type: "text",
            editable: true
        }
    ],
    {
        name: "Комментарий",
        field: "comment",
        type: "textarea",
        editable: true
    }
]