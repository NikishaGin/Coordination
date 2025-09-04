import { ExcelColumnOptions } from './excel/excel.interface';
import { ActivesType } from '../generated/prisma/enums';

export enum TypeCommonStatistics {
    COMMON = 'COMMON',
    ACTIVE = 'ACTIVE',
    DEBIT = 'DEBIT',
}

export type IdHeaders = (prefix?: string) => ExcelColumnOptions[];

export type CommonAggregatedActives = (type: string) => ExcelColumnOptions[];

export type CommonStatistics = {
    [TypeCommonStatistics.COMMON]: (isDerived: boolean) => ExcelColumnOptions[];
    [TypeCommonStatistics.ACTIVE]: ExcelColumnOptions[];
    [TypeCommonStatistics.DEBIT]: ExcelColumnOptions[];
};

export type ResolutionStatistics = (isDerived: boolean) => ExcelColumnOptions[];

export type ActivesStatistics = {
    [ActivesType.TRANSPORT]: ExcelColumnOptions[];
    [ActivesType.PROPERTY]: ExcelColumnOptions[];
    [ActivesType.DEBIT]: ExcelColumnOptions[];
    [ActivesType.OTHER]: ExcelColumnOptions[];
};

export enum StatusType {
    AIS = 'Данные из АИС',
    GMU = 'Данные из ГМУ',
    AIS_GMU = 'Пара АИС-ГМУ',
    OLD_DATA = 'Старые данные',
}

export enum StatusObjectType {
    WANTED_BEGIN = 'Розыск открыт',
    WANTED_END = 'Розыск закрыт',
    ARREST_BEGIN = 'Арест',
    ARREST_END = 'Снятие ареста',
    EVALUATION_BEGIN = 'Передано на оценку',
    EVALUATION_END = 'Оценка',
    REALIZATION_FIRST_SUBMIT = 'Передано на реализацию',
    REALIZATION_FIRST = 'Реализовано 1 торги',
    NOT_REALIZATION_FIRST = 'Не реализовано 1 торги',
    REALIZATION_SECOND_SUBMIT = 'Передано на реализацию 2',
    REALIZATION_SECOND = 'Реализовано 2 торги',
    NOT_REALIZATION_SECOND = 'Не реализовано 2 торги',
    REFUND_PROPERTY = 'Возврат имущества должнику',
    COMPLAINT = 'Обжалование',
    COMPLAINT_REVIEWED = 'Рассмотрена жалоба',
    LEASING = 'Лизинг (залог иного лица)',
    FORECLOSURE = 'Обращено взыскание',
    FORECLOSURE_CANCEL = 'Отмена взыскания',
    OTHER = 'Иное: ',
}

export enum WantedType {
    FINDING_PROPERTY = 'В связи с розыском имущества должника',
    END_PROPERTY_SEARCH_ACTIVITIES = 'В связи с выполнением всех мероприятий по розыску',
}
