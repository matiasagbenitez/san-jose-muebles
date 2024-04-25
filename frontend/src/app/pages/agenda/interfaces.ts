export interface VisitRequestFormInterface {
    id_visit_reason: string;
    status: "PENDIENTE" | "REALIZADA" | "CANCELADA";
    priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE";
    id_client: string;
    id_locality: string;
    address: string;

    notes: string;
    schedule: "NOT_SCHEDULED" | "PARTIAL_SCHEDULED" | "FULL_SCHEDULED";
    start: Date | null;
    end: Date | null;
}

export interface VisitRequestListItemInterface {
    id: number;
    schedule: "NOT_SCHEDULED" | "PARTIAL_SCHEDULED" | "FULL_SCHEDULED";
    start: Date | null;
    status: "PENDIENTE" | "REALIZADA" | "CANCELADA";
    client: string;
    locality: string;
    reason: string;
    priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE";
    overdue: boolean;
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

interface Evolution {
    id: number;
    status: "PENDIENTE" | "REALIZADA" | "CANCELADA";
    user: string;
    createdAt: Date;
}
export interface VisitRequestInterface {
    id: number,
    reason: string,
    status: "PENDIENTE" | "REALIZADA" | "CANCELADA",
    priority: "BAJA" | "MEDIA" | "ALTA" | "URGENTE",
    overdue: boolean,
    client: {
        name: string,
        phone: string,
        locality: string,
    },
    locality: string,
    address: string,
    notes: string,
    schedule: "NOT_SCHEDULED" | "PARTIAL_SCHEDULED" | "FULL_SCHEDULED",
    start: Date | null,
    end: Date | null,
    createdAt: Date,
    createdBy: string,
    evolutions: Evolution[],
}