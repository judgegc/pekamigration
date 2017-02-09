import { Owner } from './owner.interface';

export interface ViewersList {
    result: {amount: number, users: Owner[]};
    status: string;
}
