import {Decimal} from "@prisma/client/runtime/edge";
import {Prisma} from "../../generated/prisma/client";

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
    countIsLeasing?: number;
    countActives?: number;
    countArrestedActives?: number;
    countNoArrestedActives?: number;
};

export type CommonStatisticActivesType<T> = {
    COMMON: T;
    ACTIVE: T;
    DEBIT: T;
};

export type ActiveDataType<T> = T | CommonStatisticActivesType<T>;


export type ClientsType<T> = Prisma.ClientsGetPayload<{
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
        resolution: {
            amount: Decimal | null;
            balance: Decimal | null;
        };
        active: ActiveDataType<AggregatedActivesType>;
    };
    securingArrest: ActiveDataType<number>;
    statusIP: string;
    interaction?: {
        GMU?: string;
        TNO?: string;
    };
    indicators?: {
        isUpdated: boolean;
        isLeasing: boolean;
    };
};
