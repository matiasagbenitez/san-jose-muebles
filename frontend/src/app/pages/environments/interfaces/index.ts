export * from './shared';
import { Status, DesignStatus, Difficulty, Priority } from './shared';

export interface EnvironmentListInterface {
    id: number;
    project: string;
    client: string;
    type: string;
    difficulty: Difficulty;
    priority: Priority;
    des_status: DesignStatus;
    fab_status: Status;
    ins_status: Status;
    req_deadline: Date | null;
    est_deadline: Date | null;
}