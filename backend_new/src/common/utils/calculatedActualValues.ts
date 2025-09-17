import {Prisma} from "../../generated/prisma/client";
import {INTERACTION_STATUS, REALIZATIONS_ACTION_STATUS, STATUS_IP, STATUS_OBJECT} from "../constants";
import {ObjectStatus, RealizationStage} from "../../generated/prisma/enums";
import {AggregatedActivesType} from "../../modules/aggregated-statistics/aggregated-statistics.type";
import {Decimal} from "@prisma/client/runtime/edge";



export function getValueFromMap(key: any, map: { [key: string]: string }): string {
    return (key !== null) && map[key] ? map[key] : '';
}


export function getStatusIP(writExecutionDate: object | undefined): string {
    if (!writExecutionDate) return '';
    const check = ([_, value]): boolean => {
        return typeof value === 'number' ? value > 0 : value !== null;
    };
    const [field] = Object.entries(writExecutionDate).find(check) || ['Else'];
    return STATUS_IP[field];
}


export function getSecuringArrest(
    aggregatedActives: AggregatedActivesType | undefined,
    resolutionsBalance: Decimal | null | undefined
): number {
    const {
        arrest,
        isArrestedAllActives,
        isNoArrestedActives,
    } = aggregatedActives || {};

    const arrestAmount = arrest || 0;
    const balanceAmount =  resolutionsBalance || 0;

    if (arrestAmount >= balanceAmount)
        return 1;
    else if ((arrestAmount < balanceAmount) && Boolean(isArrestedAllActives))
        return 2;
    else if ((arrestAmount < balanceAmount) && Boolean(isNoArrestedActives))
        return 3;
    else
        return 4;
}


export function getInteractionStatusWithGMU(
    interactionCounts: { [key: string]: number } | undefined,
    isGMU: boolean
): string {
    if (!interactionCounts) return '';
    const isExistsSubmit: boolean = interactionCounts.submissionDate + interactionCounts.originalFilename_1 > 0;
    const isExistsReview: boolean = interactionCounts.reviewDate + interactionCounts.result + interactionCounts.originalFilename_2 > 0;
    return isExistsSubmit
            ? (isGMU ? INTERACTION_STATUS.RESPONSE_FOR_GMU : INTERACTION_STATUS.RESPONSE_FOR_MIUDOL)
            : (isExistsReview ? INTERACTION_STATUS.SUBMITTED : '');
}


export function getObjectStatus(
    objectStatus: string | null,
    otherObjectStatus: string | null,
): string {
    const otherObjectStatusText =
        (objectStatus === ObjectStatus.OTHER) && otherObjectStatus
            ? otherObjectStatus
            : '';
    return getValueFromMap(objectStatus, STATUS_OBJECT) + otherObjectStatusText;
}


export function destructuringRealization(
    realization: Prisma.RealizationsGetPayload<{}>[]
): {
    realizationFirst: Prisma.RealizationsGetPayload<{}> & { actionStatus?: string };
    realizationSecond: Prisma.RealizationsGetPayload<{}> & { actionStatus?: string };
} {
    const getActionRealizationStatus = ({ realizationDate }): string => (
        realizationDate !== null ? REALIZATIONS_ACTION_STATUS.COMPUTED : REALIZATIONS_ACTION_STATUS.NO_COMPUTED
    );

    const realizationFirst = (
        realization.find(({ stage }) => stage === RealizationStage.FIRST) ||
        {}
    ) as Prisma.RealizationsGetPayload<{}>;

    const realizationSecond =(
        realization.find(({ stage }) => stage === RealizationStage.SECOND) ||
        {}
    ) as Prisma.RealizationsGetPayload<{}>;

    realizationFirst['actionStatus'] = getActionRealizationStatus(realizationFirst);
    realizationSecond['actionStatus'] = getActionRealizationStatus(realizationSecond);

    return { realizationFirst, realizationSecond };
}
