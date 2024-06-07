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

export interface EnvironmentDetailInterface {
    id: number;
    id_project: number;
    project: string;
    id_client: number;
    client: string;
    client_phone: string;
    type: string;
    difficulty: Difficulty;
    priority: Priority;
    description: string;
    des_id: number;
    des_status: DesignStatus;
    fab_id: number;
    fab_status: Status;
    ins_id: number;
    ins_status: Status;
    req_deadline: Date | null;
    est_deadline: Date | null;
}