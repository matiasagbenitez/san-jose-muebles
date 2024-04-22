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