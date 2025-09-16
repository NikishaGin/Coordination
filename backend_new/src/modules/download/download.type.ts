import { ExcelColumnOptions } from './excel/excel.interface';
import { ActivesType } from '../../generated/prisma/enums';


export type CommonStatisticsType<T> = {
    COMMON: T;
    ACTIVE: T;
    DEBIT: T;
};

export type KeyCommonStatistics = keyof CommonStatisticsType<unknown>;

export type IdHeaders = (prefix?: string) => ExcelColumnOptions[];

export type CommonAggregatedActives = (type: KeyCommonStatistics) => ExcelColumnOptions[];

export type CommonStatistics = (isDerived: boolean) => CommonStatisticsType<ExcelColumnOptions[]>;

export type ResolutionStatistics = (isDerived: boolean) => ExcelColumnOptions[];

export type ActivesStatistics = {
    [ActivesType.TRANSPORT]: ExcelColumnOptions[];
    [ActivesType.PROPERTY]: ExcelColumnOptions[];
    [ActivesType.DEBIT]: ExcelColumnOptions[];
    [ActivesType.OTHER]: ExcelColumnOptions[];
};