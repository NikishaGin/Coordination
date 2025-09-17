/* eslint-disable */

import { ExcelColumnOptions } from './excel/excel.interface';
import { ActivesType } from "../../generated/prisma/enums";
import {
    IdHeaders,
    CommonAggregatedActives,
    CommonStatistics,
    ResolutionStatistics,
    ActivesStatistics, KeyCommonStatistics,
} from './download.type'


const ID_HEADERS: IdHeaders = (
    prefix = ''
) => {
    const source = prefix ? `${prefix}.` : '';
    return [
        { header: 'Регион',                key: `${source}tno.region.regionName` },
        { header: 'Код НО',                key: `${source}tno.CodeTNO` },
        { header: 'ИНН должника',          key: `${source}inn` },
        { header: 'Наименование должника', key: `${source}name` },
    ];
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// Заголовки для общей статистики ////////////////////////////////////////////

const COMMON_AGGREGATED_ACTIVE_HEADERS: CommonAggregatedActives = (
    type: KeyCommonStatistics
) => [
    { header: 'Арест имущества, ₽',                     key: `amounts.active.${type}.arrest`,            isNumber: true },
    { header: 'Обеспеченность остатка долга арестом',   key: `securingArrest.${type}` },
    { header: 'Оценка имущества, ₽',                    key: `amounts.active.${type}.evaluation`,        isNumber: true },
    { header: 'Принудительная реализация, ₽',           key: `amounts.active.${type}.realizationFirst`,  isNumber: true },
    { header: 'Торги 2 этап, ₽',                        key: `amounts.active.${type}.realizationSecond`, isNumber: true },
    { header: 'Результат принудительной реализации, ₽', key: `amounts.active.${type}.realizationResult`, isNumber: true },
    { header: 'Сумма возврата имущества должнику, ₽',   key: `amounts.active.${type}.refundProperty`,    isNumber: true },
];

export const HEADERS_COMMON_STATISTICS: CommonStatistics = (isDerived: boolean) => {
    const sourceResolution: string = isDerived ? 'исполнительного листа' : 'по постановлениям по статье 47 НК РФ';
    return {
        COMMON: [
            ...ID_HEADERS(),
            { header: `Сумма ${sourceResolution}, ₽`,                                  key: 'amounts.resolution.amount',              isNumber: true },
            { header: `Остаток ${sourceResolution}, ₽`,                                key: 'amounts.resolution.balance',             isNumber: true },
            { header: 'Категория должника',                                            key: 'category.category' },
            { header: 'Сумма активов и дебиторской задолженности, ₽',                  key: 'amounts.active.COMMON.totalSum',         isNumber: true },
            ...COMMON_AGGREGATED_ACTIVE_HEADERS('COMMON'),
            { header: 'Сумма по обращениям на взыскания дебиторской задолженности, ₽', key: 'amounts.active.COMMON.debitForeclosure', isNumber: true },
            { header: 'Статус ИП',                                                     key: 'statusIP' },
        ],
        ACTIVE: [
            ...ID_HEADERS(),
            { header: 'Сумма активов, ₽',                                              key: 'amounts.active.ACTIVE.totalSum',         isNumber: true },
            ...COMMON_AGGREGATED_ACTIVE_HEADERS('ACTIVE'),
        ],
        DEBIT: [
            ...ID_HEADERS(),
            { header: 'Сумма дебиторской задолженности, ₽',                            key: 'amounts.active.DEBIT.totalSum',          isNumber: true },
            ...COMMON_AGGREGATED_ACTIVE_HEADERS('DEBIT'),
            { header: 'Сумма по обращениям на взыскания дебиторской задолженности, ₽', key: 'amounts.active.DEBIT.debitForeclosure',  isNumber: true },
        ],
    }
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// Заголовки для статистики по постановления ///////////////////////////////////////

export const HEADERS_RESOLUTIONS_STATISTICS: ResolutionStatistics = (
    isDerived: boolean,
) => {
    const sourceResolution: string = isDerived ? 'исполнительного листа' : 'постановления по статье 47 НК РФ';
    const sourceResolutionSum: string = isDerived ? 'исполнительного листа' : 'по постановлениям по статье 47 НК РФ';
    return [
        ...ID_HEADERS('client'),
        { header: `Номер  ${sourceResolution}`,                                     key: 'number' },
        { header: `Дата ${sourceResolution}`,                                       key: 'date' },
        { header: `Сумма ${sourceResolutionSum}, ₽`,                                key: 'amount',                      isNumber: true },
        { header: `Остаток ${sourceResolutionSum}, ₽`,                              key: 'balance',                     isNumber: true },
        { header: 'Номер исполнительного производства/наличие сводного ИП',         key: 'WritExecutionNumber' },
        { header: 'Дата возбуждения исполнительного производства',                  key: 'WritExecutionBeginDate' },
        { header: `Дата ${sourceResolution} СПИ об окончании ИП`,                   key: 'WritExecutionEndDate' },
        { header: 'Основание окончания (прекращения) исполнительного производства', key: 'WritExecutionEndReason' },
        { header: 'Статус ИП',                                                      key: 'statusIP' },
    ]
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////// Заголовки для статистики по активам /////////////////////////////////////////

const ID_ACTIVES_HEADERS: ExcelColumnOptions[] = [
    ...ID_HEADERS('client'),
    { header: 'Статус верификации выгрузки',                                 key: 'statusText' },
    { header: 'Дата добавления/обновления данных',                           key: 'uploadDate' },
    { header: 'Категория должника',                                          key: 'client.category.category' },
    { header: 'Сумма всего по постановлениям по статье 47 НК РФ, ₽',         key: 'resolution._sum.amount',                                isNumber: true },
    { header: 'Текущий остаток по постановлениям по статье 47 НК РФ, ₽',     key: 'resolution._sum.balance',                               isNumber: true },
];

const REGISTRATION_HEADERS: ExcelColumnOptions[] = [
    { header: 'Дата регистрации владения',                                   key: 'registrationBeginDate' },
    { header: 'Дата прекращения владения',                                   key: 'registrationEndDate' },
];

const ENCUMBRANCE_HEADERS: ExcelColumnOptions[] = [
    { header: 'Вид обременения',                                             key: 'encumbranceType' },
    { header: 'Дата обременения',                                            key: 'encumbranceDate' },
    { header: 'Наименование залогодержателя / лизингодателя',                key: 'nameLessor' },
];

const DEBIT_FORECLOSURE_HEADERS: ExcelColumnOptions[] = [
    { header: 'Обращение на взыскание ДЗ',                                   key: 'debitForeclosure.requestDate' },
    { header: 'Сумма обращения на взыскание ДЗ, ₽',                          key: 'debitForeclosure.requestAmount',                        isNumber: true },
    { header: 'Постановление об отмене обращения на взыскания ДЗ',           key: 'debitForeclosure.cancelDate' },
    { header: 'Основание отмены обращения на ДЗ',                            key: 'debitForeclosure.cancelReason' },
];

const COMMON_ACTIVE_HEADERS: (type: ActivesType) => ExcelColumnOptions[] = (
    type,
) => {
    const validateRigstration: Array<ActivesType> = [ActivesType.TRANSPORT, ActivesType.PROPERTY];
    return [
        { header: 'Статус объекта',                                          key: 'objectStatusText' },
        ...(validateRigstration.includes(type) ? REGISTRATION_HEADERS : []),
        ...(type !== ActivesType.DEBIT ? ENCUMBRANCE_HEADERS : []),
        { header: 'Верифицированы активы ФССП',                              key: 'isVerifiedText' },
        { header: 'Арест имущества',                                         key: 'arrest.beginDate' },
        { header: 'Сумма ареста, ₽',                                         key: 'arrest.amount',                                         isNumber: true },
        { header: 'Статус ареста',                                           key: 'arrest.status' },
        { header: 'Заведено розыскное дело',                                 key: 'wanted.beginDate' },
        { header: 'Прекращено розыскное дело',                               key: 'wanted.endDate' },
        { header: 'Результат розыска',                                       key: 'wanted.resultText' },
        { header: 'Статус розыскного дела',                                  key: 'wanted.status' },
        { header: 'Передано на оценку',                                      key: 'evaluation.beginDate' },
        { header: 'Принятие результатов оценки имущества',                   key: 'evaluation.endDate' },
        { header: 'Сумма оценки, ₽',                                         key: 'evaluation.amount',                                     isNumber: true },
        { header: 'Статус оценки',                                           key: 'evaluation.status' },
        { header: 'Передано на реализацию',                                  key: 'realizationFirst.submitDate' },
        { header: 'Сумма переданного имущества на реализацию, ₽',            key: 'realizationFirst.submitAmount',                        isNumber: true },
        { header: 'Статус передачи на реализацию',                           key: 'realizationFirst.submitStatus' },
        { header: 'Дата первых торгов',                                      key: 'realizationFirst.realizationDate' },
        { header: 'Отчет о реализации (1 этап)',                             key: 'realizationFirst.realizationResultDate' },
        { header: 'Сумма реализованного имущества (1 этап), ₽',              key: 'realizationFirst.realizedPropertyAmount',              isNumber: true },
        { header: 'Уведомление о не реализации',                             key: 'realizationFirst.notificationNotRealizationDate' },
        { header: 'Причина признания  1 торгов не состоявшимися',            key: 'realizationFirst.notRealizationReason' },
        { header: 'Текущий статус 1 торгов',                                 key: 'realizationFirst.actionStatus' },
        { header: 'Статус реализации 1 этап',                                key: 'realizationFirst.realizationStatus' },
        { header: 'Постановление о снижении цены',                           key: 'realizationSecond.submitDate' },
        { header: 'Сумма снижения цены, ₽',                                  key: 'realizationSecond.submitAmount',                       isNumber: true },
        { header: 'Статус передачи на реализацию 2 этап',                    key: 'realizationSecond.submitStatus' },
        { header: 'Дата вторых торгов',                                      key: 'realizationSecond.realizationDate' },
        { header: 'Отчет о реализации (2 этап)',                             key: 'realizationSecond.realizationResultDate' },
        { header: 'Сумма реализованного имущества (2 этап), ₽',              key: 'realizationSecond.realizedPropertyAmount',             isNumber: true },
        { header: 'Уведомление о не реализации (2 этап)',                    key: 'realizationSecond.notificationNotRealizationDate' },
        { header: 'Причина признания  2 торгов не состоявшимися',            key: 'realizationSecond.notRealizationReason' },
        { header: 'Текущий статус 2 торгов',                                 key: 'realizationSecond.actionStatus' },
        { header: 'Статус реализации 2 этап',                                key: 'realizationSecond.realizationStatus' },
        { header: 'Акт передачи имущества должнику',                         key: 'refundProperty.date' },
        { header: 'Сумма возврата имущества должнику, ₽',                    key: 'refundProperty.amount',                                 isNumber: true },
        ...(type === ActivesType.DEBIT ? DEBIT_FORECLOSURE_HEADERS : []),
        { header: 'Дата снятия ареста',                                      key: 'arrest.endDate' },
        { header: 'Основания снятия ареста с имущества',                     key: 'arrest.endReason' },
        { header: 'Лицо подавшее жалобу',                                    key: 'complaint.personWhoFiled' },
        { header: 'Предмет жалобы',                                          key: 'complaint.subject' },
        { header: 'Орган рассматривающий жалобу',                            key: 'complaint.source' },
        { header: 'Дата жалобы',                                             key: 'complaint.date' },
        { header: 'Результат рассмотрения жалобы',                           key: 'complaint.result' },
        { header: 'Примечание',                                              key: 'comment' },
    ];
}

export const HEADERS_ACTIVES_STATISTICS: ActivesStatistics = {
    TRANSPORT: [
        ...ID_ACTIVES_HEADERS,
        { header: 'Марка',                                                   key: 'description.name' },
        { header: 'VIN-номер',                                               key: 'description.vin' },
        { header: 'Государственный номер',                                   key: 'description.stateNumber' },
        { header: 'Год выпуска',                                             key: 'description.yearRelease' },
        { header: 'Стоимость, ₽',                                            key: 'cost',                                                  isNumber: true },
        ...COMMON_ACTIVE_HEADERS(ActivesType.TRANSPORT),
    ],
    PROPERTY: [
        ...ID_ACTIVES_HEADERS,
        { header: 'Наименование',                                            key: 'description.name' },
        { header: 'Площадь',                                                 key: 'description.landArea' },
        { header: 'Кадастровый номер',                                       key: 'description.cadastralNumber' },
        { header: 'Адрес',                                                   key: 'description.address' },
        { header: 'Стоимость, ₽',                                            key: 'cost',                                                  isNumber: true },
        { header: 'Размер доли в праве',                                     key: 'description.shareSize' },
        ...COMMON_ACTIVE_HEADERS(ActivesType.PROPERTY),
    ],
    DEBIT: [
        ...ID_ACTIVES_HEADERS,
        { header: 'ИНН дебитора',                                            key: 'description.debitorInn' },
        { header: 'Наименование дебитора',                                   key: 'description.name' },
        { header: 'Адрес дебитора',                                          key: 'description.debitorAddress' },
        { header: 'Дата ходатайства',                                        key: 'description.debitorDate' },
        { header: 'Сумма по ходатайству, ₽',                                 key: 'cost',                                                  isNumber: true },
        ...COMMON_ACTIVE_HEADERS(ActivesType.DEBIT),
    ],
    OTHER: [
        ...ID_ACTIVES_HEADERS,
        { header: 'Наименование',                                            key: 'description.name' },
        { header: 'Стоимость, ₽',                                            key: 'cost',                                                  isNumber: true },
        ...COMMON_ACTIVE_HEADERS(ActivesType.OTHER),
    ],
};
