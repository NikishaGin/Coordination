/// Виды изменений данных
export enum ActionHistory {
    INSERT,
    UPDATE,
    DELETE,
}

/// Виды активов
// export enum ActivesType {
//     TRANSPORT,
//     PROPERTY,
//     GROUND,
//     DEBIT,
//     OTHER,
// }

/// Статус верификации выгрузки
export enum DataStatus {
    AIS,
    GMU,
    AIS_GMU,
    OLD_DATA,
}

/// Статусы объекта
export enum ObjectStatus {
    WANTED_BEGIN,
    WANTED_END,
    ARREST_BEGIN,
    ARREST_END,
    EVALUATION_BEGIN,
    EVALUATION_END,
    REALIZATION_FIRST_SUBMIT,
    REALIZATION_FIRST,
    NOT_REALIZATION_FIRST,
    REALIZATION_SECOND_SUBMIT,
    REALIZATION_SECOND,
    NOT_REALIZATION_SECOND,
    REFUND_PROPERTY,
    COMPLAINT,
    COMPLAINT_REVIEWED,
    LEASING,
    FORECLOSURE,
    FORECLOSURE_CANCEL,
    OTHER,
}

/// Статусы лизинга
export enum LeasStatus {
    IS_PLEDGE_HOLDER,
    IS_NOT_PLEDGE_HOLDER,
    NO_PLEDGE,
}

/// Результаты розаска
export enum WantedResults {
    FINDING_PROPERTY,
    END_PROPERTY_SEARCH_ACTIVITIES,
}

/// Этапы реализации
export enum RealizationStage {
    FIRST,
    SECOND,
}
