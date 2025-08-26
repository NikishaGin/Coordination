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
    { header: 'Регион', key: 'tno.region.regionName' },
    { header: 'Код НО', key: 'tno.codeTNO' },
    { header: 'ИНН должника', key: 'inn' },
    { header: 'Наименование должника', key: 'name' },
];

export const HEADERS_COMMON_STATISTICS: CommonStatistics = {
    COMMON: [
        ...ID_HEADERS,
        { header: 'Категория должника', key: '' },
        { header: '', key: '' },
        { header: '', key: '' },
    ],
    ACTIVE: [
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
};

export const HEADERS_RESOLUTIONS_STATISTICS: ExcelColumnOptions[] = [
    ...ID_HEADERS,
    { header: '', key: '' },
    { header: '', key: '' },
    { header: '', key: '' },
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