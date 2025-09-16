import {Decimal} from "@prisma/client/runtime/edge";
import {Prisma} from "../../generated/prisma/client";
import {CommonStatisticsType} from "../download/download.type";


type StatisticsType = 'Simple' | 'CommonStats';

export type SelectType<DataType extends StatisticsType, T> = DataType extends 'Simple' ? T : CommonStatisticsType<T>;

export type AggregatedActivesType = {
    clientId: number;
    totalSum?: Decimal | null;
    arrest?: Decimal | null;
    wanted?: Decimal | null;
    evaluation?: Decimal | null;
    realizationFirst?: Decimal | null;
    realizationSecond?: Decimal | null;
    realizationResult?: Decimal | null;
    refundProperty?: Decimal | null;
    debitForeclosure?: Decimal | null;
    lastUploadDate?: Date | null;
    isLeasing?: boolean;
    isArrestedAllActives?: boolean;
    isNoArrestedActives?: boolean;
};

export type AggregatedIndicatorsType = {
    isUpdated: boolean;
    isLeasing: boolean;
};

export type ClientsType<DataType extends StatisticsType> = Prisma.ClientsGetPayload<{
    omit: {
        tnoId: true;
        sospId: true;
        categoryId: true;
        isVisible: true;
    };
    include: {
        tno: { select: { CodeTNO: true } };
        sosp: { select: { CodeSOSP: true } };
        category: true;
    };
}> & {
    amounts: {
        resolution?: {
            amount: Decimal | null;
            balance: Decimal | null;
        };
        active: SelectType<DataType, AggregatedActivesType | undefined>;
    };
    securingArrest: SelectType<DataType, number>;
    statusIP: string;
    interaction: DataType extends 'CommonStats' ? undefined : {
        GMU?: string;
        TNO?: string;
    };
    indicators: DataType extends 'CommonStats' ? undefined : AggregatedIndicatorsType;
};
