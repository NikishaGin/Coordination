export type DateOrCount = number | Date | null;

export type WritExecutionDateType = {
    WritExecutionEndDate: DateOrCount;
    WritExecutionStopDate: DateOrCount;
    WritExecutionPostponementDate: DateOrCount;
    WritExecutionTerminateDate: DateOrCount;
};