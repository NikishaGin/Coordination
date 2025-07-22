export const objStatusOptions = [
    {text: "", value: null},
    {text: "Розыск открыт", value: "wanted_open"},
    {text: "Розыск закрыт", value: "wanted_close"},
    {text: "Арест", value: "arrest"},
    {text: "Передано на оценку", value: "evaluation_submit"},
    {text: "Оценка", value: "evaluation"},
    {text: "Передано на реализацию", value: "realization_submit_1"},
    {text: "Реализовано 1 торги", value: "realization_1"},
    {text: "Не реализовано 1 торги", value: "not_realization_1"},
    {text: "Передано на реализацию 2", value: "realization_submit_2"},
    {text: "Реализовано 2 торги", value: "realization_2"},
    {text: "Не реализовано 2 торги", value: "not_realization_2"},
    {text: "Возврат имущества должнику", value: "return_property_to_debtor"},
    {text: "Снятие ареста", value: "arrest_end"},
    {text: "Обжалование", value: "complaint"},
    {text: "Рассмотрена жалоба", value: "complaint_has_been_reviewed"},
    {text: "Лизинг (залог иного лица)", value: "lizing"},
    {text: "Иное", value: "other"},
];

export const yesNoOptions = [
    {value: 1, text: "Да"},
    {value: 0, text: "Нет"},
];

export const installedOptions = [
    {value: 1, text: "В связи с розыском имущества должника"},
    {value: 0, text: "В связи с выполнением всех мероприятий по розыску"},
];

export const isFnsLizingOptions = [
    {value: 1, text: "Является"},
    {value: 2, text: "Не является"},
    {value: 0, text: "Не является, нет залога"},
];