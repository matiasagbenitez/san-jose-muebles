import { Op } from "sequelize";
import { Entity } from "../../database/mysql/models";
import { CustomError, CreateEntityDTO, EntityDetailEntity, EntityListEntity, PaginationDto } from "../../domain";

export interface EntityFilters {
    name: string;
    id_locality: number;
}

export class EntityService {

    public async getEntities() {
        const rows = await Entity.findAll();
        const entities = rows.map(row => EntityListEntity.fromObject(row));
        return { items: entities };
    }

    public async getEntitiesPaginated(paginationDto: PaginationDto, filters: EntityFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = {
            [Op.or]: [
                { id: { [Op.like]: `%${filters.name}%` } },
                { name: { [Op.like]: `%${filters.name}%` } },
                { phone: { [Op.like]: `%${filters.name}%` } },
            ]
        };
        if (filters.id_locality) where = { ...where, id_locality: filters.id_locality };

        const [rows, total] = await Promise.all([
            Entity.findAll({
                order: [['name', 'ASC']],
                where,
                include: [{
                    association: 'locality',
                    include: [{
                        association: 'province',
                    }]
                }],
                offset: (page - 1) * limit,
                limit
            }),
            Entity.count({ where })
        ]);
        const entities = rows.map(row => EntityListEntity.fromObject(row));
        return { items: entities, total_items: total };
    }

    public async getEntity(id: number) {
        const row = await Entity.findByPk(id, {
            include: [{
                association: 'locality',
            }]
        });
        if (!row) throw CustomError.notFound('¡Entidad no encontrada!');
        const { ...entity } = EntityDetailEntity.fromObject(row);
        return { item: entity };
    }

    public async createEntity(dto: CreateEntityDTO) {
        try {
            await Entity.create({ ...dto });
            return { message: '¡Entidad creada correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡La entidad que intenta crear ya existe!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateEntity(id: number, dto: CreateEntityDTO) {
        try {
            await Entity.update({ ...dto }, { where: { id } });
            return { message: '¡Entidad actualizada correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡La entidad que intenta crear ya existe!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteEntity(id: number) {
        const row = await Entity.findByPk(id);
        if (!row) throw CustomError.notFound('¡Entidad no encontrada!');

        try {
            await row.destroy();
            return { message: '¡Entidad eliminada correctamente!' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}