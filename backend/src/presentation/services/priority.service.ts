import { Op } from "sequelize";
import { Priority } from "../../database/mysql/models";
import { CustomError, PriorityDto, PriorityEntity, PaginationDto } from "../../domain";

export interface PriorityFilters {
    name: string;
}
export class PriorityService {

    public async getPriorities() {
        const priorities = await Priority.findAll();
        const prioritiesEntities = priorities.map(priority => PriorityEntity.fromObject(priority));
        return { items: prioritiesEntities };
    }

    public async getPrioritiesPaginated(paginationDto: PaginationDto, filters: PriorityFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [priorities, total] = await Promise.all([
            Priority.findAll({ where, offset: (page - 1) * limit, limit }),
            Priority.count({ where })
        ]);
        const prioritiesEntities = priorities.map(priority => PriorityEntity.fromObject(priority));
        return { items: prioritiesEntities, total_items: total };
    }

    public async getPriority(id: number) {
        const priority = await Priority.findByPk(id);
        if (!priority) throw CustomError.notFound('Prioridad no encontrada');
        const { ...priorityEntity } = PriorityEntity.fromObject(priority);
        return { priority: priorityEntity };
    }

    public async createPriority(createPriorityDto: PriorityDto) {
        const priority = await Priority.findOne({ where: { name: createPriorityDto.name } });
        if (priority) throw CustomError.badRequest('La prioridad ya existe');

        try {
            const priority = await Priority.create({
                name: createPriorityDto.name,
                color: createPriorityDto.color
            });
            const { ...priorityEntity } = PriorityEntity.fromObject(priority);
            return { priority: priorityEntity, message: 'Prioridad creada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La prioridad que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updatePriority(id: number, updatePriorityDto: PriorityDto) {
        const priority = await Priority.findByPk(id);
        if (!priority) throw CustomError.notFound('Prioridad no encontrada');

        try {
            await priority.update(updatePriorityDto);
            const { ...priorityEntity } = PriorityEntity.fromObject(priority);
            return { priority: priorityEntity, message: 'Prioridad actualizada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La prioridad que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    } 

    public async deletePriority(id: number) {
        const priority = await Priority.findByPk(id);
        if (!priority) throw CustomError.notFound('Prioridad no encontrada');

        try {
            await priority.destroy();
            return { message: 'Prioridad eliminada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}