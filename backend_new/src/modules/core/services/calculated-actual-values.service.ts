import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { AggregatedActivesType } from '../../aggregated-statistics/aggregated-statistics.type';
import { getValueFromMap } from "../../../common/utils/data-transform";
import { ObjectStatus } from "../../../generated/prisma/enums";
import { INTERACTION_STATUS, REALIZATIONS_ACTION_STATUS, STATUS_IP, STATUS_OBJECT } from "../../../constants";



@Injectable()
export class CalculatedActualValuesService {
    getStatusIP(writExecutionDate: object | undefined): string {
        if (!writExecutionDate) return '';
        const check = ([_, value]): boolean => {
            return typeof value === 'number' ? value > 0 : value !== null;
        };
        const [field] = Object.entries(writExecutionDate).find(check) || ['Else'];
        return getValueFromMap(field, STATUS_IP);
    }


    getSecuringArrest(
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


    getInteractionStatusWithGMU(
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


    getObjectStatus(
        objectStatus: string | null,
        otherObjectStatus: string | null,
    ): string {
        const otherObjectStatusText =
            (objectStatus === ObjectStatus.OTHER) && otherObjectStatus
                ? otherObjectStatus
                : '';
        return getValueFromMap(objectStatus, STATUS_OBJECT) + otherObjectStatusText;
    }


   getActionRealizationStatus({ realizationDate }): string {
       return realizationDate ? REALIZATIONS_ACTION_STATUS.COMPUTED : REALIZATIONS_ACTION_STATUS.NO_COMPUTED;
   }
}
