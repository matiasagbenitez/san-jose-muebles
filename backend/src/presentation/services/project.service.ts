import { Op } from "sequelize";
import { Project } from "../../database/mysql/models";
import { CustomError, CreateProjectDTO, PaginationDto, ProjectListableEntity } from "../../domain";

export interface ProjectFilters {
    name?: string;
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

        const [rows, total] = await Promise.all([
            Project.findAll({
                where,
                include: [
                    { association: 'client', attributes: ['name'] },
                    { association: 'locality', attributes: ['name'] },
                ],
                offset: (page - 1) * limit,
                limit
            }),
            Project.count({ where })
        ]);
        const entities = rows.map(project => ProjectListableEntity.fromObject(project));
        return { items: entities, total_items: total };
    }

    public async getProject(id: number) {
        const project = await Project.findByPk(id, {
            include: [
                { association: 'client', attributes: ['name'] },
                { association: 'locality', attributes: ['name'] },
            ]
        });
        if (!project) throw CustomError.notFound('Proyecto no encontrado');
        const { ...entity } = ProjectListableEntity.fromObject(project);
        return { item: entity };
    }

    public async createProject(dto: CreateProjectDTO) {

        try {
            await Project.create({ ...dto });
            return { message: 'Proyecto creado correctamente' };
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