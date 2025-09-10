import {Prisma} from "../../../generated/prisma/client";
import {WritExecutionDateType} from "./type";
import {STATUS_IP} from "../../constants";


export function getStatusIP(writExecutionDate: WritExecutionDateType): string {
    const check = ([_, value]): boolean => {
        return typeof value === 'number' ? value > 0 : value !== null;
    };
    const [field] = Object.entries(writExecutionDate).find(check) || ['Else'];
    return STATUS_IP[field];
}

export function getActionRealizationStatus(realization: Prisma.RealizationsGetPayload<{}>): string {
    return realization.realizationDate !== null ? 'Завершено' : 'Не завершено';
}



/*
const objectStatus =
    active.objectStatus === ObjectStatus.OTHER
        ? (active.otherObjectStatus ?? '')
        : '';

active['objectStatusText'] = active.objectStatus
    ? StatusObjectType[active.objectStatus] + objectStatus
    : null;

active['isVerifiedText'] =
    active.isVerified !== null ? (active.isVerified ? 'Да' : 'Нет') : '';
*/