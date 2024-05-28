export * from './shared';
import { Status, DesignStatus } from './shared';

export interface EnvironmentListInterface {
    id: number;
    project: string;
    client: string;
    type: string;
    des_status: DesignStatus;
    fab_status: Status;
    ins_status: Status;
}