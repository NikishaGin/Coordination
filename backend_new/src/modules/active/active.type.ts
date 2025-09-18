import {ActivesType} from "../../generated/prisma/enums";

export type ActivesStatisticsType = { id: ActivesType, value: number, count: number };

export type ActivesStatisticsResultType = {
    stats: ActivesStatisticsType[],
    TOTAL: number,
};
