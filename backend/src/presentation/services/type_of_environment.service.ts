import { Op } from "sequelize";
import { TypeOfEnvironment } from "../../database/mysql/models";
import { CustomError, NameDto, TypeOfEnvironmentEntity, PaginationDto } from "../../domain";

export interface TypeOfEnvironmentFilters {
    name: string;
}
export class TypeOfEnvironmentService {

    public async getTypeOfEnvironments() {
        const typeOfEnvironments = await TypeOfEnvironment.findAll({ order: [['name', 'ASC']] });
        const typeOfEnvironmentsEntities = typeOfEnvironments.map(typeOfEnvironment => TypeOfEnvironmentEntity.fromObject(typeOfEnvironment));
        return { items: typeOfEnvironmentsEntities };
    }

    public async getTypeOfEnvironmentsPaginated(paginationDto: PaginationDto, filters: TypeOfEnvironmentFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [typeOfEnvironments, total] = await Promise.all([
            TypeOfEnvironment.findAll({ where, offset: (page - 1) * limit, limit }),
            TypeOfEnvironment.count({ where })
        ]);
        const typeOfEnvironmentsEntities = typeOfEnvironments.map(typeOfEnvironment => TypeOfEnvironmentEntity.fromObject(typeOfEnvironment));
        return { items: typeOfEnvironmentsEntities, total_items: total };
    }

    public async getTypeOfEnvironment(id: number) {
        const typeOfEnvironment = await TypeOfEnvironment.findByPk(id);
        if (!typeOfEnvironment) throw CustomError.notFound('Tipo de ambiente no encontrado');
        const { ...typeOfEnvironmentEntity } = TypeOfEnvironmentEntity.fromObject(typeOfEnvironment);
        return { typeOfEnvironment: typeOfEnvironmentEntity };
    }

    public async createTypeOfEnvironment(createNameDto: NameDto) {
        const typeOfEnvironment = await TypeOfEnvironment.findOne({ where: { name: createNameDto.name } });
        if (typeOfEnvironment) throw CustomError.badRequest('El tipo de ambiente ya existe');

        try {
            const typeOfEnvironment = await TypeOfEnvironment.create({
                name: createNameDto.name
            });
            const { ...typeOfEnvironmentEntity } = TypeOfEnvironmentEntity.fromObject(typeOfEnvironment);
            return { typeOfEnvironment: typeOfEnvironmentEntity, message: 'Tipo de ambiente creado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El tipo de ambiente que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateTypeOfEnvironment(id: number, updateNameDto: NameDto) {
        const typeOfEnvironment = await TypeOfEnvironment.findByPk(id);
        if (!typeOfEnvironment) throw CustomError.notFound('Tipo de ambiente no encontrado');

        try {
            await typeOfEnvironment.update(updateNameDto);
            const { ...typeOfEnvironmentEntity } = TypeOfEnvironmentEntity.fromObject(typeOfEnvironment);
            return { typeOfEnvironment: typeOfEnvironmentEntity, message: 'Tipo de ambiente actualizado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El tipo de ambiente que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteTypeOfEnvironment(id: number) {
        const typeOfEnvironment = await TypeOfEnvironment.findByPk(id);
        if (!typeOfEnvironment) throw CustomError.notFound('Tipo de ambiente no encontrado');
        
        try {
            await typeOfEnvironment.destroy();
            return { message: 'Tipo de ambiente eliminado correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}