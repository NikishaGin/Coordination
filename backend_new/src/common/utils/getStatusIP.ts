type DateOrCount = number | Date | null;

type WritExecutionDateType = {
    WritExecutionEndDate: DateOrCount;
    WritExecutionStopDate: DateOrCount;
    WritExecutionPostponementDate: DateOrCount;
    WritExecutionTerminateDate: DateOrCount;
};

const StatusMap = {
    WritExecutionEndDate: 'Окончено',
    WritExecutionStopDate: 'Приостановлено',
    WritExecutionPostponementDate: 'Отложено',
    WritExecutionTerminateDate: 'Прекращено',
    Else: 'На исполнении',
};

export function getStatusIP(writExecutionDate: WritExecutionDateType): string {
    const check = ([_, value]): boolean => {
        return typeof value === 'number' ? value > 0 : value !== null;
    };
    const [field] = Object.entries(writExecutionDate).find(check) || ['Else'];
    return StatusMap[field];
}
