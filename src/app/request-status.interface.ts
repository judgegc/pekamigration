
export enum Status {BEGIN, INPROGRESS, END};
export interface RequestStatus {
    status: Status;
    progress?: number;
}
