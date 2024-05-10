import { Op, Order } from "sequelize";
import { Project } from "../../database/mysql/models";
import { CustomError, CreateProjectDTO, PaginationDto, ProjectListEntity, ProjectDetailEntity } from "../../domain";

export interface ProjectFilters {
    id_client?: number;
    id_locality?: number;
    status?: string;
    priority?: string;
}

export class ProjectService {

    public async getProjects() {
        const rows = await Project.findAll();
        return { items: rows };
    }

    public async getProjectsPaginated(paginationDto: PaginationDto, filters: ProjectFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.id_client) where = { ...where, id_client: filters.id_client };
        if (filters.id_locality) where = { ...where, id_locality: filters.id_locality };
        if (filters.priority) where = { ...where, priority: filters.priority };
        switch (filters.status) {
            case 'PENDIENTE':
                where = { ...where, status: 'PENDIENTE' };
                break;
            case 'PROCESO':
                where = { ...where, status: 'PROCESO' };
                break;
            case 'PAUSADO':
                where = { ...where, status: 'PAUSADO' };
                break;
            case 'FINALIZADO':
                where = { ...where, status: 'FINALIZADO' };
                break;
            case 'CANCELADO':
                where = { ...where, status: 'CANCELADO' };
            case 'ALL':
                break;
            default:
                where = { ...where, status: { [Op.or]: ['PENDIENTE', 'PROCESO', 'PAUSADO'] } };
                break;
        }

        const [rows, total] = await Promise.all([
            Project.findAll({
                where,
                include: [
                    { association: 'client', attributes: ['name', 'last_name'] },
                    { association: 'locality', attributes: ['name'] },
                ],
                offset: (page - 1) * limit,
                limit,
                // ORDER = PROCESO, PENDIENTE, PAUSADO, FINALIZADO, CANCELADO
                order: [['status', 'ASC']],
            }),
            Project.count({ where })
        ]);
        const entities = rows.map(project => ProjectListEntity.fromObject(project));
        return { items: entities, total_items: total };
    }

    public async getProject(id: number) {
        const project = await Project.findByPk(id, {
            include: [
                { association: 'client', attributes: ['id', 'name', 'last_name', 'phone'] },
                { association: 'locality', attributes: ['name'] },
            ]
        });
        if (!project) throw CustomError.notFound('Proyecto no encontrado');
        const { ...entity } = ProjectDetailEntity.fromObject(project);
        return { item: entity };
    }

    public async createProject(dto: CreateProjectDTO) {
        try {
            const { id } = await Project.create({ ...dto });
            return { id, message: '¡Proyecto creado correctamente!' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateProject(id: number, dto: CreateProjectDTO) {
        const project = await Project.findByPk(id);
        if (!project) throw CustomError.notFound('Proyecto no encontrado');
        try {
            await project.update({ ...dto });
            return { message: 'Proyecto actualizado correctamente' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteProject(id: number) {
        const project = await Project.findByPk(id);
        if (!project) throw CustomError.notFound('Proyecto no encontrado');

        try {
            await project.destroy();
            return { message: 'Proyecto eliminado correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}