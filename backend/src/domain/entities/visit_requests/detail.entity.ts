import { CustomError } from '../../errors/custom.error';

interface ClientData {
    name: string;
    phone: string;
    locality: string;
}

export class VisitRequestDetailEntity {
    constructor(
        public id: number,
        public reason: string,
        public reason_color: string,
        public status: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA',
        public priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE',
        public overdue: boolean,
        public client: ClientData,
        public locality: string,
        public address: string,
        public title: string,
        public description: string,
        public start: Date,
        public end: Date,
        public createdAt: Date
    ) { }

    static fromObject(object: { [key: string]: any }): VisitRequestDetailEntity {
        const { id, reason, status, priority, client, locality, address, title, description, start, end, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!reason) throw CustomError.badRequest('Falta el motivo');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!priority) throw CustomError.badRequest('Falta la prioridad');
        if (!client) throw CustomError.badRequest('Falta el cliente');
        if (!locality) throw CustomError.badRequest('Falta la localidad');
        if (!title) throw CustomError.badRequest('Falta el título');
        if (!start) throw CustomError.badRequest('Falta la fecha de inicio');
        if (!end) throw CustomError.badRequest('Falta la fecha de fin');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        const overdue = new Date() > new Date(start);
        
        return new VisitRequestDetailEntity(
            id, 
            reason.name,
            reason.color,
            status,
            priority,
            overdue,
            {
                name: client.name,
                phone: client.phone,
                locality: client.locality.name,
            },
            locality.name,
            address,
            title,
            description,
            start,
            end,
            createdAt
        );
    }
}