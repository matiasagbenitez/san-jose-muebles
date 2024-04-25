import { VisitRequest } from "../../database/mysql/models";
import { CustomError, VisitRequestDTO, VisitRequestListEntity, PaginationDto, VisitRequestDetailEntity, VisitRequestEditableEntity, CalendarEventEntity, CalendarIntervalDto, UpdateVisitRequestStatusDTO } from "../../domain";
import { Op, Order, Sequelize } from "sequelize";

export interface VisitRequestFilters {
    id_client?: number;
    id_locality?: number;
    id_visit_reason?: number;
    priority?: string;
    status?: string;
    start?: Date;
    end?: Date;
    schedule?: string;
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
        if (filters.schedule) where = { ...where, schedule: filters.schedule };

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
                order: [
                    Sequelize.literal('start IS NULL, start ASC'),
                ],
            }),
            VisitRequest.count({ where })
        ]);
        const entities = rows.map(priority => VisitRequestListEntity.fromObject(priority));
        return { items: entities, total_items: total };
    }

    public async getVisitRequestsCalendar() {

        const date = new Date();
        const from_date = new Date(date.getFullYear(), date.getMonth() - 1, 24);
        const to_date = new Date(date.getFullYear(), date.getMonth() + 1, 5, 24, 59, 59);

        const rows = await VisitRequest.findAll({
            where: {
                status: 'PENDIENTE',
                start: { [Op.between]: [from_date, to_date], [Op.ne]: null }
            },
            include: [
                { association: 'reason', attributes: ['name', 'color'] },
                { association: 'client', attributes: ['name', 'phone'], include: [{ association: 'locality', attributes: ['name'] }] },
                { association: 'locality', attributes: ['name'] },
            ],
        });
        const entities = rows.map(priority => CalendarEventEntity.fromObject(priority));
        return { items: entities };
    }

    public async getVisitRequestsCalendarPaginated(dto: CalendarIntervalDto) {
        const { from_date, to_date } = dto;

        const rows = await VisitRequest.findAll({
            where: {
                status: 'PENDIENTE',
                start: { [Op.between]: [from_date, to_date], [Op.ne]: null }
            },
            include: [
                { association: 'reason', attributes: ['name', 'color'] },
                { association: 'client', attributes: ['name', 'phone'], include: [{ association: 'locality', attributes: ['name'] }] },
                { association: 'locality', attributes: ['name'] },
            ],
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
                { association: 'user', attributes: ['name'] }
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

    public async updateVisitRequestStatus(id: number, dto: UpdateVisitRequestStatusDTO) {
        try {
            await VisitRequest.update({ ...dto }, { where: { id } });
            return { message: '¡Estado de la visita actualizado correctamente!' };
        } catch (error: any) {
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