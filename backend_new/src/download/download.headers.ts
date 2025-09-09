/* eslint-disable */

import { ExcelColumnOptions } from './excel/excel.interface';
import { ActivesType } from "../generated/prisma/enums";
import {
    IdHeaders,
    TypeCommonStatistics,
    CommonAggregatedActives,
    CommonStatistics,
    ResolutionStatistics,
    ActivesStatistics,
} from './download.type'


const ID_HEADERS: IdHeaders = (
    prefix = ''
) => {
    const source = prefix ? `${prefix}.` : '';
    return [
        { header: 'Регион',                key: `${source}tno.region.regionName` },
        { header: 'Код НО',                key: `${source}tno.codeTNO` },
        { header: 'ИНН должника',          key: `${source}inn` },
        { header: 'Наименование должника', key: `${source}name` },
    ];
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// Заголовки для общей статистики ////////////////////////////////////////////

const COMMON_AGGREGATED_ACTIVE_HEADERS: CommonAggregatedActives = (
    type: string
) => [
    { header: 'Арест имущества, ₽',                     key: `amounts.actives.${type}.arrest`,            numFmt: '#,##0.00' },
    { header: 'Обеспеченность остатка долга арестом',   key: `securingArrest.${type}` },
    { header: 'Оценка имущества, ₽',                    key: `amounts.actives.${type}.evaluation`,        numFmt: '#,##0.00' },
    { header: 'Принудительная реализация, ₽',           key: `amounts.actives.${type}.realizationFirst`,  numFmt: '#,##0.00' },
    { header: 'Торги 2 этап, ₽',                        key: `amounts.actives.${type}.realizationSecond`, numFmt: '#,##0.00' },
    { header: 'Результат принудительной реализации, ₽', key: `amounts.actives.${type}.realizationResult`, numFmt: '#,##0.00' },
    { header: 'Сумма возврата имущества должнику, ₽',   key: `amounts.actives.${type}.refundProperty`,    numFmt: '#,##0.00' },
];

export const HEADERS_COMMON_STATISTICS: CommonStatistics = {
    COMMON: (isDerived: boolean) => {
        const sourceResolution: string = isDerived ? 'исполнительного листа' : 'по постановлениям по статье 47 НК РФ';
        return [
            ...ID_HEADERS(),
            { header: `Сумма ${sourceResolution}, ₽`,                                  key: 'amounts.resolution.amount',               numFmt: '#,##0.00' },
            { header: `Остаток ${sourceResolution}, ₽`,                                key: 'amounts.resolution.balance',              numFmt: '#,##0.00' },
            { header: 'Категория должника',                                            key: 'category.category' },
            { header: 'Сумма активов и дебиторской задолженности, ₽',                  key: 'amounts.actives.COMMON.totalSum',         numFmt: '#,##0.00' },
            ...COMMON_AGGREGATED_ACTIVE_HEADERS(TypeCommonStatistics.COMMON),
            { header: 'Сумма по обращениям на взыскания дебиторской задолженности, ₽', key: 'amounts.actives.COMMON.debitForeclosure', numFmt: '#,##0.00' },
            { header: 'Статус ИП',                                                     key: 'statusIP' },
        ]
    },
    ACTIVE: [
        ...ID_HEADERS(),
        { header: 'Сумма активов, ₽',                                                  key: 'amounts.actives.ACTIVE.totalSum',         numFmt: '#,##0.00' },
        ...COMMON_AGGREGATED_ACTIVE_HEADERS(TypeCommonStatistics.ACTIVE),
    ],
    DEBIT: [
        ...ID_HEADERS(),
        { header: 'Сумма дебиторской задолженности, ₽',                                key: 'amounts.actives.DEBIT.totalSum',          numFmt: '#,##0.00' },
        ...COMMON_AGGREGATED_ACTIVE_HEADERS(TypeCommonStatistics.DEBIT),
        { header: 'Сумма по обращениям на взыскания дебиторской задолженности, ₽',     key: 'amounts.actives.DEBIT.debitForeclosure',  numFmt: '#,##0.00' },
    ],
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
        { header: `Сумма ${sourceResolutionSum}, ₽`,                                key: 'amount',  numFmt: '#,##0.00' },
        { header: `Остаток ${sourceResolutionSum}, ₽`,                              key: 'balance', numFmt: '#,##0.00' },
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
    { header: 'Сумма всего по постановлениям по статье 47 НК РФ, ₽',         key: 'resolution._sum.amount',  numFmt: '#,##0.00' },
    { header: 'Текущий остаток по постановлениям по статье 47 НК РФ, ₽',     key: 'resolution._sum.balance', numFmt: '#,##0.00' },
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
    { header: 'Сумма обращения на взыскание ДЗ, ₽',                          key: 'debitForeclosure.requestAmount', numFmt: '#,##0.00' },
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
        { header: 'Сумма ареста, ₽',                                         key: 'arrest.amount', numFmt: '#,##0.00' },
        { header: 'Статус ареста',                                           key: 'arrest.status' },
        { header: 'Заведено розыскное дело',                                 key: 'wanted.beginDate' },
        { header: 'Прекращено розыскное дело',                               key: 'wanted.endDate' },
        { header: 'Результат розыска',                                       key: 'wanted.resultText' },
        { header: 'Статус розыскного дела',                                  key: 'wanted.status' },
        { header: 'Передано на оценку',                                      key: 'evaluation.beginDate' },
        { header: 'Принятие результатов оценки имущества',                   key: 'evaluation.endDate' },
        { header: 'Сумма оценки, ₽',                                         key: 'evaluation.amount', numFmt: '#,##0.00' },
        { header: 'Статус оценки',                                           key: 'evaluation.status' },
        { header: 'Передано на реализацию',                                  key: 'realization.first.submitDate' },
        { header: 'Сумма переданного имущества на реализацию, ₽',            key: 'realization.first.submitAmount', numFmt: '#,##0.00' },
        { header: 'Статус передачи на реализацию',                           key: 'realization.first.submitStatus' },
        { header: 'Дата первых торгов',                                      key: 'realization.first.realizationDate' },
        { header: 'Отчет о реализации (1 этап)',                             key: 'realization.first.realizationResultDate' },
        { header: 'Сумма реализованного имущества (1 этап), ₽',              key: 'realization.first.realizedPropertyAmount', numFmt: '#,##0.00' },
        { header: 'Уведомление о не реализации',                             key: 'realization.first.notificationNotRealizationDate' },
        { header: 'Причина признания  1 торгов не состоявшимися',            key: 'realization.first.notRealizationReason' },
        { header: 'Текущий статус 1 торгов',                                 key: 'realization.first.actionStatus' },
        { header: 'Статус реализации 1 этап',                                key: 'realization.first.realizationStatus' },
        { header: 'Постановление о снижении цены',                           key: 'realization.second.submitDate' },
        { header: 'Сумма снижения цены, ₽',                                  key: 'realization.second.submitAmount', numFmt: '#,##0.00' },
        { header: 'Статус передачи на реализацию 2 этап',                    key: 'realization.second.submitStatus' },
        { header: 'Дата вторых торгов',                                      key: 'realization.second.realizationDate' },
        { header: 'Отчет о реализации (2 этап)',                             key: 'realization.second.realizationResultDate' },
        { header: 'Сумма реализованного имущества (2 этап), ₽',              key: 'realization.second.realizedPropertyAmount', numFmt: '#,##0.00' },
        { header: 'Уведомление о не реализации (2 этап)',                    key: 'realization.second.notificationNotRealizationDate' },
        { header: 'Причина признания  2 торгов не состоявшимися',            key: 'realization.second.notRealizationReason' },
        { header: 'Текущий статус 2 торгов',                                 key: 'realization.second.actionStatus' },
        { header: 'Статус реализации 2 этап',                                key: 'realization.second.realizationStatus' },
        { header: 'Акт передачи имущества должнику',                         key: 'refundProperty.date' },
        { header: 'Сумма возврата имущества должнику, ₽',                    key: 'refundProperty.amount', numFmt: '#,##0.00' },
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
        { header: 'Стоимость, ₽',                                            key: 'cost', numFmt: '#,##0.00' },
        ...COMMON_ACTIVE_HEADERS(ActivesType.TRANSPORT),
    ],
    PROPERTY: [
        ...ID_ACTIVES_HEADERS,
        { header: 'Наименование',                                            key: 'description.name' },
        { header: 'Площадь',                                                 key: 'description.landArea' },
        { header: 'Кадастровый номер',                                       key: 'description.cadastralNumber' },
        { header: 'Адрес',                                                   key: 'description.address' },
        { header: 'Стоимость, ₽',                                            key: 'cost', numFmt: '#,##0.00' },
        { header: 'Размер доли в праве',                                     key: 'description.shareSize' },
        ...COMMON_ACTIVE_HEADERS(ActivesType.PROPERTY),
    ],
    DEBIT: [
        ...ID_ACTIVES_HEADERS,
        { header: 'ИНН дебитора',                                            key: 'description.debitorInn' },
        { header: 'Наименование дебитора',                                   key: 'description.name' },
        { header: 'Адрес дебитора',                                          key: 'description.debitorAddress' },
        { header: 'Дата ходатайства',                                        key: 'description.debitorDate' },
        { header: 'Сумма по ходатайству, ₽',                                 key: 'cost', numFmt: '#,##0.00' },
        ...COMMON_ACTIVE_HEADERS(ActivesType.DEBIT),
    ],
    OTHER: [
        ...ID_ACTIVES_HEADERS,
        { header: 'Наименование',                                            key: 'description.name' },
        { header: 'Стоимость, ₽',                                            key: 'cost', numFmt: '#,##0.00' },
        ...COMMON_ACTIVE_HEADERS(ActivesType.OTHER),
    ],
};
