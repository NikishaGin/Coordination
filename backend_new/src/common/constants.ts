export const STATUS_IP = {
    WritExecutionEndDate: 'Окончено',
    WritExecutionStopDate: 'Приостановлено',
    WritExecutionPostponementDate: 'Отложено',
    WritExecutionTerminateDate: 'Прекращено',
    Else: 'На исполнении',
};


export const INTERACTION_STATUS = {
    RESPONSE_FOR_GMU: 'Получено сообщение от МИУДОЛ',
    RESPONSE_FOR_MIUDOL: 'Получен ответ от ГМУ',
    SUBMITTED: 'Отправлено',
}


export const STATUS_TYPE = {
    AIS: 'Данные из АИС',
    GMU: 'Данные из ГМУ',
    AIS_GMU: 'Пара АИС-ГМУ',
    OLD_DATA: 'Старые данные',
};


export const STATUS_OBJECT = {
    WANTED_BEGIN: 'Розыск открыт',
    WANTED_END: 'Розыск закрыт',
    ARREST_BEGIN: 'Арест',
    ARREST_END: 'Снятие ареста',
    EVALUATION_BEGIN: 'Передано на оценку',
    EVALUATION_END: 'Оценка',
    REALIZATION_FIRST_SUBMIT: 'Передано на реализацию',
    REALIZATION_FIRST: 'Реализовано 1 торги',
    NOT_REALIZATION_FIRST: 'Не реализовано 1 торги',
    REALIZATION_SECOND_SUBMIT: 'Передано на реализацию 2',
    REALIZATION_SECOND: 'Реализовано 2 торги',
    NOT_REALIZATION_SECOND: 'Не реализовано 2 торги',
    REFUND_PROPERTY: 'Возврат имущества должнику',
    COMPLAINT: 'Обжалование',
    COMPLAINT_REVIEWED: 'Рассмотрена жалоба',
    LEASING: 'Лизинг (залог иного лица)',
    FORECLOSURE: 'Обращено взыскание',
    FORECLOSURE_CANCEL: 'Отмена взыскания',
    OTHER: 'Иное: ',
};


export const VERIFICATION_STATUS = {
    true: 'Да',
    false: 'Нет'
};


export const WANTED_STATUS = {
    FINDING_PROPERTY: 'В связи с розыском имущества должника',
    END_PROPERTY_SEARCH_ACTIVITIES: 'В связи с выполнением всех мероприятий по розыску',
};


export const REALIZATIONS_ACTION_STATUS = {
    COMPUTED: 'Завершено',
    NO_COMPUTED: 'Не завершено'
};


export const OrderActives = {
    TRANSPORT: 0,
    PROPERTY: 1,
    GROUND: 2,
    DEBIT: 3,
    OTHER: 4,
};


export const DEADLINES = {
    WEEK: 7 * 24 * 60 * 60 * 1000
};