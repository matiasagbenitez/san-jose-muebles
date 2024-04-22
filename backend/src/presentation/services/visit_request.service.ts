import { Op } from "sequelize";
import { VisitRequest } from "../../database/mysql/models";
import { CustomError, VisitRequestDTO, VisitRequestListEntity, PaginationDto } from "../../domain";

export interface VisitRequestFilters {
    name: string;
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
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [rows, total] = await Promise.all([
            VisitRequest.findAll({
                where,
                include: [
                    { association: 'reason', attributes: ['name', 'color'] },
                    { association: 'client', attributes: ['name'] },
                    { association: 'locality', attributes: ['name'] },
                ],
                offset: (page - 1) * limit,
                limit
            }),
            VisitRequest.count({ where })
        ]);
        const entities = rows.map(priority => VisitRequestListEntity.fromObject(priority));
        return { items: entities, total_items: total };
    }

    public async getVisitRequest(id: number) {

    }

    public async createVisitRequest(createDto: VisitRequestDTO) {

        try {
            await VisitRequest.create({ ...createDto });
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