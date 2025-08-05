export const objStatusOptions = (type) => [
    {text: "", value: null},
    {text: "Розыск открыт", value: "WANTED_BEGIN"},
    {text: "Розыск закрыт", value: "WANTED_END"},
    {text: "Арест", value: "ARREST_BEGIN"},
    {text: "Передано на оценку", value: "EVALUATION_BEGIN"},
    {text: "Оценка", value: "EVALUATION_END"},
    {text: "Передано на реализацию", value: "REALIZATION_FIRST_SUBMIT"},
    {text: "Реализовано 1 торги", value: "REALIZATION_FIRST"},
    {text: "Не реализовано 1 торги", value: "NOT_REALIZATION_FIRST"},
    {text: "Передано на реализацию 2", value: "REALIZATION_SECOND_SUBMIT"},
    {text: "Реализовано 2 торги", value: "REALIZATION_SECOND"},
    {text: "Не реализовано 2 торги", value: "NOT_REALIZATION_SECOND"},
    {text: "Возврат имущества должнику", value: "REFUND_PROPERTY"},
    {text: "Снятие ареста", value: "ARREST_END"},
    {text: "Обжалование", value: "COMPLAINT"},
    {text: "Рассмотрена жалоба", value: "COMPLAINT_REVIEWED"},
    {text: "Лизинг (залог иного лица)", value: "LEASING"},
    ...(
        (type === "debit")
            ? [
                {text: "Обращено взыскание", value: "FORECLOSURE"},
                {text: "Отмена взыскания", value: "FORECLOSURE_CANCEL"},
            ]
            : []
    ),
    {text: "Иное", value: "OTHER"},
];

export const isVerifiedOptions = [
    {value: null, text: ""},
    {value: true, text: "Да"},
    {value: false, text: "Нет"},
];

export const wantedResultOptions = [
    {value: "FINDING_PROPERTY", text: "В связи с розыском имущества должника"},
    {value: "END_PROPERTY_SEARCH_ACTIVITIES", text: "В связи с выполнением всех мероприятий по розыску"},
];

export const isFnsLizingOptions = [
    {value: "IS_PLEDGE_HOLDER", text: "Является"},
    {value: "IS_NOT_PLEDGE_HOLDER", text: "Не является"},
    {value: "NO_PLEDGE", text: "Не является, нет залога"},
];