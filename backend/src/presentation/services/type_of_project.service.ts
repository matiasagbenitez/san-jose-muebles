import { Op } from "sequelize";
import { TypeOfProject } from "../../database/mysql/models";
import { CustomError, TypeOfProjectDto, TypeOfProjectEntity, PaginationDto } from "../../domain";

export interface TypeOfProjectFilters {
    name: string;
}
export class TypeOfProjectService {

    public async getTypeOfProjects() {
        const typesOfProjects = await TypeOfProject.findAll();
        const typesOfProjectsEntities = typesOfProjects.map(typeOfProject => TypeOfProjectEntity.fromObject(typeOfProject));
        return { items: typesOfProjectsEntities };
    }

    public async getTypeOfProjectsPaginated(paginationDto: PaginationDto, filters: TypeOfProjectFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) {
            where = {
                [Op.or]: [
                    { name: { [Op.like]: `%${filters.name}%` } },
                    { description: { [Op.like]: `%${filters.name}%` } }
                ]
            };
        }

        const [typesOfProjects, total] = await Promise.all([
            TypeOfProject.findAll({ where, offset: (page - 1) * limit, limit }),
            TypeOfProject.count({ where })
        ]);
        const typesOfProjectsEntities = typesOfProjects.map(typeOfProject => TypeOfProjectEntity.fromObject(typeOfProject));
        return { items: typesOfProjectsEntities, total_items: total };
    }

    public async getTypeOfProject(id: number) {
        const typeOfProject = await TypeOfProject.findByPk(id);
        if (!typeOfProject) throw CustomError.notFound('Tipo de proyecto no encontrado');
        const { ...typeOfProjectEntity } = TypeOfProjectEntity.fromObject(typeOfProject);
        return { typeOfProject: typeOfProjectEntity };
    }

    public async createTypeOfProject(createTypeOfProjectDto: TypeOfProjectDto) {
        const typeOfProject = await TypeOfProject.findOne({ where: { name: createTypeOfProjectDto.name } });
        if (typeOfProject) throw CustomError.badRequest('El tipo de proyecto ya existe');

        try {
            const typeOfProject = await TypeOfProject.create({
                name: createTypeOfProjectDto.name,
                description: createTypeOfProjectDto.description
            });
            const { ...typeOfProjectEntity } = TypeOfProjectEntity.fromObject(typeOfProject);
            return { typeOfProject: typeOfProjectEntity, message: 'Tipo de proyecto creado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El tipo de proyecto que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateTypeOfProject(id: number, updateTypeOfProjectDto: TypeOfProjectDto) {
        const typeOfProject = await TypeOfProject.findByPk(id);
        if (!typeOfProject) throw CustomError.notFound('Tipo de proyecto no encontrado');

        try {
            await typeOfProject.update(updateTypeOfProjectDto);
            const { ...typeOfProjectEntity } = TypeOfProjectEntity.fromObject(typeOfProject);
            return { typeOfProject: typeOfProjectEntity, message: 'Tipo de proyecto actualizado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El tipo de proyecto que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteTypeOfProject(id: number) {
        const typeOfProject = await TypeOfProject.findByPk(id);
        if (!typeOfProject) throw CustomError.notFound('Tipo de proyecto no encontrado');
        
        try {
            await typeOfProject.destroy();
            return { message: 'Tipo de proyecto eliminado correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}