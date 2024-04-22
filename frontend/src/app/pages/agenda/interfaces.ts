export interface VisitFormInterface {
    id_visit_reason: string;
    visible_for: "ALL" | "ADMIN";
    status: "PENDIENTE" | "REALIZADA" | "CANCELADA";
    priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE";
    id_client: string;
    id_locality: string;
    address: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    createdAt: Date;
}

interface ClientData {
    name: string;
    phone: string;
    locality: string;
}

export interface VisitRequestInterface {
    id: number;
    reason: string;
    reason_color: string;
    status: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA';
    priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
    overdue: boolean;
    client: ClientData;
    locality: string;
    address: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    createdAt: Date;
}

export interface EditableVisitRequest {
    id: number;
    id_visit_reason: number;
    visible_for: string;
    status: string;
    priority: string;
    id_client: number;
    id_locality: number;
    address: string;
    title: string;
    description: string;
    start: string;
    end: string;
    id_user: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}