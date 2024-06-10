import { Op, Order } from "sequelize";
import { Project, ProjectEvolution } from "../../database/mysql/models";
import { CustomError, CreateProjectDTO, PaginationDto, ProjectListEntity, ProjectDetailEntity, ProjectBasicDataEntity, CreateProjectEvolutionDTO } from "../../domain";

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
                order: [['status', 'ASC'], ['priority', 'DESC']]
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
                {
                    association: 'environments', include:
                        [
                            { association: 'type', attributes: ['id', 'name'] },
                            { association: 'design', attributes: ['id', 'status'] },
                            { association: 'fabrication', attributes: ['id', 'status'] },
                            { association: 'installation', attributes: ['id', 'status'] },
                        ]
                },
            ]
        });
        if (!project) throw CustomError.notFound('Proyecto no encontrado');
        const { ...entity } = ProjectDetailEntity.fromObject(project);
        return { item: entity };
    }

    public async getProjectBasic(id: number) {
        const project = await Project.findByPk(id, {
            attributes: ['id', 'title', 'status'],
            include: [
                { association: 'client', attributes: ['name', 'last_name'] },
                { association: 'locality', attributes: ['name'] },
            ]
        });
        if (!project) throw CustomError.notFound('¡Proyecto no encontrado!');
        const { ...entity } = ProjectBasicDataEntity.fromObject(project);
        return { item: entity };
    }

    public async getProjectEditable(id: number) {
        const [basic, initialForm] = await Promise.all([
            Project.findByPk(id, {
                include: [
                    { association: 'client', attributes: ['name', 'last_name'] },
                    { association: 'locality', attributes: ['name'] },
                ]
            }),
            Project.findByPk(id)
        ]);
        if (!basic || !initialForm) throw CustomError.notFound('Proyecto no encontrado');
        const { ...entity } = ProjectBasicDataEntity.fromObject(basic);

        return { basic: entity, initialForm };
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

    public async updateStatus(id_project: number, dto: CreateProjectEvolutionDTO) {

        const transaction = await Project.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡Error en la transacción!');

        try {

            const design = await Project.update({ status: dto.status }, { where: { id: id_project }, transaction });
            if (!design) throw CustomError.notFound('¡No se pudo actualizar el estado del proyecto!');

            const evolution = await ProjectEvolution.create({ id_project, ...dto }, { transaction });
            if (!evolution) throw CustomError.internalServerError('¡No se pudo registrar la evolución del proyecto!');

            await transaction.commit();

            return { ok: true, status: dto.status };
        } catch (error) {
            console.log(error);
            await transaction.rollback();
            throw CustomError.internalServerError('¡No se pudo actualizar el estado del proyecto!');
        }
    }

}