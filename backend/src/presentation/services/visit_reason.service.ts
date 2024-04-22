import { Op } from "sequelize";
import { VisitReason } from "../../database/mysql/models";
import { CustomError, VisitReasonDTO, VisitReasonEntity, PaginationDto, Select2ItemEntity } from "../../domain";

export interface VisitReasonFilters {
    name: string;
}
export class VisitReasonService {

    public async getVisitReasons() {
        const priorities = await VisitReason.findAll();
        const prioritiesEntities = priorities.map(priority => VisitReasonEntity.fromObject(priority));
        return { items: prioritiesEntities };
    }

    public async getVisitReasonsList() {
        const rows = await VisitReason.findAll({ order: [['name', 'ASC']] });
        const entities = rows.map(row => Select2ItemEntity.fromObject(row));
        return { visit_reasons: entities };
    }

    public async getVisitReasonsPaginated(paginationDto: PaginationDto, filters: VisitReasonFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [priorities, total] = await Promise.all([
            VisitReason.findAll({ where, offset: (page - 1) * limit, limit }),
            VisitReason.count({ where })
        ]);
        const prioritiesEntities = priorities.map(priority => VisitReasonEntity.fromObject(priority));
        return { items: prioritiesEntities, total_items: total };
    }

    public async getVisitReason(id: number) {
        const priority = await VisitReason.findByPk(id);
        if (!priority) throw CustomError.notFound('Motivo de visita no encontrada');
        const { ...priorityEntity } = VisitReasonEntity.fromObject(priority);
        return { priority: priorityEntity };
    }

    public async createVisitReason(createVisitReasonDto: VisitReasonDTO) {
        const priority = await VisitReason.findOne({ where: { name: createVisitReasonDto.name } });
        if (priority) throw CustomError.badRequest('El motivo de visita ya existe');

        try {
            const priority = await VisitReason.create({ ...createVisitReasonDto });
            const { ...priorityEntity } = VisitReasonEntity.fromObject(priority);
            return { priority: priorityEntity, message: 'Motivo de visita creado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El motivo de visita que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateVisitReason(id: number, updateVisitReasonDto: VisitReasonDTO) {
        const priority = await VisitReason.findByPk(id);
        if (!priority) throw CustomError.notFound('Motivo de visita no encontrada');

        try {
            await priority.update(updateVisitReasonDto);
            const { ...priorityEntity } = VisitReasonEntity.fromObject(priority);
            return { priority: priorityEntity, message: 'Motivo de visita actualizadp correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El motivo de visita que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    } 

    public async deleteVisitReason(id: number) {
        const priority = await VisitReason.findByPk(id);
        if (!priority) throw CustomError.notFound('Motivo de visita no encontradp');

        try {
            await priority.destroy();
            return { message: 'Motivo de visita eliminado correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}