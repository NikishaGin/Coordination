import { ExcelColumnOptions } from './excel/excel.interface';

type CommonStatistics = {
    COMMON: ExcelColumnOptions[];
    ACTIVE: ExcelColumnOptions[];
    DEBIT: ExcelColumnOptions[];
};

type ActivesStatistics = {
    TRANSPORT: ExcelColumnOptions[];
    PROPERTY: ExcelColumnOptions[];
    GROUND: ExcelColumnOptions[];
    DEBIT: ExcelColumnOptions[];
    OTHER: ExcelColumnOptions[];
};

const ID_HEADERS: ExcelColumnOptions[] = [
    { header: 'Регион',                key: 'tno.region.regionName' },
    { header: 'Код НО',                key: 'tno.codeTNO' },
    { header: 'ИНН должника',          key: 'inn' },
    { header: 'Наименование должника', key: 'name' },
];

const COMMON_AGGREGATED_ACTIVE_HEADERS: ExcelColumnOptions[] = [
    { header: 'Арест имущества, ₽',                     key: 'amounts.actives.arrest' },
    { header: 'Обеспеченность остатка долга арестом',   key: 'amounts.actives.?????????????????' },
    { header: 'Оценка имущества, ₽',                    key: 'amounts.actives.evaluation' },
    { header: 'Принудительная реализация, ₽',           key: 'amounts.actives.realizationFirst' },
    { header: 'Торги 2 этап, ₽',                        key: 'amounts.actives.realizationSecond' },
    { header: 'Результат принудительной реализации, ₽', key: 'amounts.actives.realizationResult' },
    { header: 'Сумма возврата имущества должнику, ₽',   key: 'amounts.actives.refundProperty' },
];

export const HEADERS_COMMON_STATISTICS: CommonStatistics = {
    COMMON: [
        ...ID_HEADERS,
        { header: 'Сумма по постановлениям по статье 47 НК РФ',                    key: 'amounts.resolution.amount' },
        { header: 'Остаток по постановлениям по статье 47 НК РФ',                  key: 'amounts.resolution.balance' },



        { header: 'Категория должника',                                            key: 'category.category' },
        { header: 'Сумма активов и дебиторской задолженности, ₽',                  key: 'amounts.actives.totalSum' },
        ...COMMON_AGGREGATED_ACTIVE_HEADERS,
        { header: 'Сумма по обращениям на взыскания дебиторской задолженности, ₽', key: 'amounts.actives.debitForeclosure' },
        { header: 'Статус ИП',                                                     key: 'statusIP' },
    ],
    ACTIVE: [
        ...ID_HEADERS,
        { header: 'Сумма активов, ₽',                                              key: 'amounts.actives.totalSum' },
        ...COMMON_AGGREGATED_ACTIVE_HEADERS,
    ],
    DEBIT: [
        ...ID_HEADERS,
        { header: 'Сумма дебиторской задолженности, ₽',                            key: 'amounts.actives.totalSum' },
        ...COMMON_AGGREGATED_ACTIVE_HEADERS,
        { header: 'Сумма по обращениям на взыскания дебиторской задолженности, ₽', key: 'amounts.actives.debitForeclosure' },
    ],
};

export const HEADERS_RESOLUTIONS_STATISTICS: ExcelColumnOptions[] = [
    ...ID_HEADERS,
    { header: '', key: '' },
    { header: '', key: '' },
    { header: 'Сумма по постановлениям по статье 47 НК РФ',                    key: 'resolution.amount' },
    { header: 'Остаток по постановлениям по статье 47 НК РФ',                  key: 'resolution.balance' },
    { header: '', key: '' },
    { header: '', key: '' },
    { header: '', key: '' },
    { header: 'Статус ИП',                                                     key: 'resolution.statusIP' },
];

export const HEADERS_ACTIVES_STATISTICS: ActivesStatistics = {
    TRANSPORT: [
        ...ID_HEADERS,
        { header: '', key: '' },
        { header: '', key: '' },
        { header: '', key: '' },
    ],
    PROPERTY: [
        ...ID_HEADERS,
        { header: '', key: '' },
        { header: '', key: '' },
        { header: '', key: '' },
    ],
    GROUND: [
        ...ID_HEADERS,
        { header: '', key: '' },
        { header: '', key: '' },
        { header: '', key: '' },
    ],
    DEBIT: [
        ...ID_HEADERS,
        { header: '', key: '' },
        { header: '', key: '' },
        { header: '', key: '' },
    ],
    OTHER: [
        ...ID_HEADERS,
        { header: '', key: '' },
        { header: '', key: '' },
        { header: '', key: '' },
    ],
};