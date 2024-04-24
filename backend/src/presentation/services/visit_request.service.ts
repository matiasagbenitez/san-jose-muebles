import { VisitRequest } from "../../database/mysql/models";
import { CustomError, VisitRequestDTO, VisitRequestListEntity, PaginationDto, VisitRequestDetailEntity, VisitRequestEditableEntity, CalendarEventEntity } from "../../domain";
import { Op, Order } from "sequelize";

enum OrderCriteria {
    DEFAULT = '',
    DATE_CLOSE = 'date_close',
    DATE_FAR = 'date_far',
    CREATE_CLOSE = 'create_close',
    CREATE_FAR = 'create_far',
    LESS_URGENT = 'less_urgent',
    MORE_URGENT = 'more_urgent'
}
export interface VisitRequestFilters {
    id_client?: number;
    id_locality?: number;
    id_visit_reason?: number;
    priority?: string;
    status?: string;
    start?: Date;
    end?: Date;
    order_criteria?: string;
}
export class VisitRequestService {

    public async getVisitRequests() {
        const rows = await VisitRequest.findAll();
        const entities = rows.map(priority => VisitRequestListEntity.fromObject(priority));
        return { items: entities };
    }

    public async getVisitRequestsPaginated(paginationDto: PaginationDto, filters: VisitRequestFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.id_client) where = { ...where, id_client: filters.id_client };
        if (filters.id_locality) where = { ...where, id_locality: filters.id_locality };
        if (filters.id_visit_reason) where = { ...where, id_visit_reason: filters.id_visit_reason };
        if (filters.priority) where = { ...where, priority: filters.priority };

        switch (filters.status) {
            case 'PENDIENTE':
                where = { ...where, status: 'PENDIENTE' };
                break;
            case 'REALIZADA':
                where = { ...where, status: 'REALIZADA' };
                break;
            case 'CANCELADA':
                where = { ...where, status: 'CANCELADA' };
                break;
            case 'ALL':
                break;
            default:
                where = { ...where, status: 'PENDIENTE' };
                break;
        }

        if (filters.start && filters.end) {
            where = { ...where, start: { [Op.between]: [filters.start, filters.end] } }
        } else if (filters.start) {
            where = { ...where, start: { [Op.gte]: filters.start } }
        } else if (filters.end) {
            where = { ...where, start: { [Op.lte]: filters.end } }
        }

        const [rows, total] = await Promise.all([
            VisitRequest.findAll({
                where,
                include: [
                    { association: 'reason', attributes: ['name', 'color'] },
                    { association: 'client', attributes: ['name'] },
                    { association: 'locality', attributes: ['name'] },
                ],
                offset: (page - 1) * limit,
                limit,
            }),
            VisitRequest.count({ where })
        ]);
        const entities = rows.map(priority => VisitRequestListEntity.fromObject(priority));
        return { items: entities, total_items: total };
    }

    public async getVisitRequestsCalendar() {
        const rows = await VisitRequest.findAll({
            where: { status: 'PENDIENTE', start: { [Op.ne]: null } },
            include: [
                { association: 'reason', attributes: ['name', 'color'] },
                { association: 'client', attributes: ['name', 'phone'], include: [{ association: 'locality', attributes: ['name'] }] },
                { association: 'locality', attributes: ['name'] },
            ]
        });
        const entities = rows.map(priority => CalendarEventEntity.fromObject(priority));
        return { items: entities };
    }

    public async getVisitRequest(id: number) {
        const row = await VisitRequest.findByPk(id, {
            include: [
                { association: 'reason', attributes: ['name', 'color'] },
                { association: 'client', attributes: ['name', 'phone'], include: [{ association: 'locality', attributes: ['name'] }] },
                { association: 'locality', attributes: ['name'] },
            ]
        });
        if (!row) throw CustomError.notFound('¡Solicitud de visita no encontrada!');

        const entity = VisitRequestDetailEntity.fromObject(row);
        return { item: entity };
    }

    public async getVisitRequestEditable(id: number) {
        const row = await VisitRequest.findByPk(id);
        if (!row) throw CustomError.notFound('¡Solicitud de visita no encontrada!');
        const entity = VisitRequestEditableEntity.fromObject(row);
        return { item: entity };
    }

    public async createVisitRequest(createDto: VisitRequestDTO, id_user: number) {

        try {
            await VisitRequest.create({ ...createDto, id_user });
            return { message: '¡Solitud de visita creada correctamente!' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateVisitRequest(id: number, updateDto: VisitRequestDTO) {
        try {
            await VisitRequest.update({ ...updateDto }, { where: { id } });
            return { message: '¡Solicitud de visita actualizada correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw CustomError.badRequest('¡No se puede actualizar la solicitud de visita!');
            }
            if (error.name === 'SequelizeValidationError') {
                throw CustomError.badRequest(`${error.errors[0].message}`);
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteVisitRequest(id: number) {
        try {
            await VisitRequest.destroy({ where: { id } });
            return { message: '¡Solicitud de visita eliminada correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw CustomError.badRequest('¡No se puede eliminar la solicitud de visita!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

}