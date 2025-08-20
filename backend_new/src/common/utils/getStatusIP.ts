type CountDate = {
    WritExecutionEndDate: number;
    WritExecutionStopDate: number;
    WritExecutionPostponementDate: number;
    WritExecutionTerminateDate: number;
};

export function getStatusIP(count: CountDate): string {
    if (count.WritExecutionEndDate > 0) return 'Окончено';
    else if (count.WritExecutionStopDate > 0) return 'Приостановлено';
    else if (count.WritExecutionPostponementDate > 0) return 'Отложено';
    else if (count.WritExecutionTerminateDate > 0) return 'Прекращено';
    else return 'На исполнении';
}
