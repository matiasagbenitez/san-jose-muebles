import { Op } from "sequelize";
import { Design, Environment, Fabrication, Installation } from "../../database/mysql/models";
import { CustomError, CreateEnvironmentDTO, EnvironmentsByProjectEntity, PaginationDto, EnvironmentsListEntity, EnvironmentDetailEntity } from "../../domain";

export interface EnvironmentFilters {
    des_status: 'PROCESO' | 'PENDIENTE' | 'PAUSADO' | 'PRESENTAR' | 'PRESENTADO' | 'REVISION' | 'FINALIZADO' | 'CANCELADO';
    fab_status: 'PROCESO' | 'PENDIENTE' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO';
    ins_status: 'PROCESO' | 'PENDIENTE' | 'PAUSADO' | 'FINALIZADO' | 'CANCELADO';
    id_client: number;
    difficulty: 'BAJA' | 'MEDIA' | 'ALTA';
    priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';
}

export class EnvironmentService {

    public async getEnvironmentsByProject(id_project: number) {

        const [rows, total] = await Promise.all([
            Environment.findAll({
                where: { id_project },
                include: [
                    { association: 'type', attributes: ['id', 'name'] },
                    { association: 'design', attributes: ['id', 'status'] },
                    { association: 'fabrication', attributes: ['id', 'status'] },
                    { association: 'installation', attributes: ['id', 'status'] }
                ],
                order: [['updatedAt', 'DESC'], ['priority', 'DESC']]
            }),
            Environment.count({ where: { id_project } })
        ]);
        const entities = rows.map(row => EnvironmentsByProjectEntity.fromObject(row));
        return { items: entities, total_items: total };
    }

    public async getAllPaginated(paginationDto: PaginationDto, filters: EnvironmentFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};

        if (filters.difficulty) where = { ...where, difficulty: filters.difficulty };
        if (filters.priority) where = { ...where, priority: filters.priority };

        const include = [
            { association: 'type', attributes: ['id', 'name'] },
            {
                association: 'project',
                attributes: ['id', 'title'],
                where: filters.id_client ? { id_client: filters.id_client } : { id_client: { [Op.not]: null } },
                include: [{ association: 'client', attributes: ['id', 'name', 'last_name'] }]
            },
            {
                association: 'design',
                attributes: ['id', 'status'],
                where: filters.des_status ? { status: filters.des_status } : { status: { [Op.not]: null } }
            },
            {
                association: 'fabrication',
                attributes: ['id', 'status'],
                where: filters.fab_status ? { status: filters.fab_status } : { status: { [Op.not]: null } }
            },
            {
                association: 'installation',
                attributes: ['id', 'status'],
                where: filters.ins_status ? { status: filters.ins_status } : { status: { [Op.not]: null } }
            }
        ];


        const [rows, total] = await Promise.all([
            Environment.findAll({
                where,
                include,
                offset: (page - 1) * limit,
                limit,
                order: [['updatedAt', 'DESC'], ['priority', 'DESC'], ['difficulty', 'ASC']]
            }),
            Environment.count({
                where,
                include
            })
        ]);

        const entities = rows.map(row => EnvironmentsListEntity.fromObject(row));
        return { items: entities, total_items: total };
    }

    public async getEnvironment(id_project: number, id_environment: number) {
        const row = await Environment.findByPk(id_environment, {
            include: [
                { association: 'type', attributes: ['id', 'name'] },
                { association: 'project', attributes: ['id', 'title'], include: [{ association: 'client', attributes: ['id', 'name', 'last_name', 'phone'] }] },
                { association: 'design', attributes: ['id', 'status', 'updatedAt'] },
                { association: 'fabrication', attributes: ['id', 'status', 'updatedAt'] },
                { association: 'installation', attributes: ['id', 'status', 'updatedAt'] }
            ]
        });
        if (!row) throw CustomError.notFound('¡El ambiente solicitado no existe!');
        if (row.id_project !== id_project) throw CustomError.badRequest('¡El ambiente solicitado no pertenece al proyecto!');

        const { ...entity } = EnvironmentDetailEntity.fromObject(row);
        return { item: entity };
    }

    public async getEnvironmentEditable(id_environment: number, id_project: number,) {
        const row = await Environment.findByPk(id_environment);
        if (!row) throw CustomError.notFound('¡El ambiente solicitado no existe!');
        if (row.id_project !== id_project) throw CustomError.badRequest('¡El ambiente solicitado no pertenece al proyecto!');

        return { item: row };
    }

    public async createEnvironment(dto: CreateEnvironmentDTO) {
        const transaction = await Environment.sequelize!.transaction();
        if (!transaction) throw CustomError.internalServerError('¡Error al crear la transacción!');

        try {
            const environment = await Environment.create({ ...dto }, { transaction });
            const id_environment = environment.id;

            const [_, __, ___] = await Promise.all([
                Design.create({ id_environment, status: 'PENDIENTE' }, { transaction }),
                Fabrication.create({ id_environment, status: 'PENDIENTE' }, { transaction }),
                Installation.create({ id_environment, status: 'PENDIENTE' }, { transaction })
            ]);

            await transaction.commit();

            return { message: '¡El ambiente se creó correctamente!' };
        } catch (error: any) {
            await transaction.rollback();
            console.log(error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡El ambiente que intenta crear ya existe!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateEnvironment(id: number, dto: CreateEnvironmentDTO) {
        try {
            await Environment.update({ ...dto }, { where: { id } });
            return { message: '¡El ambiente se actualizó correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡El ambiente que intenta actualizar ya existe!');
            }
            if (error.name === 'SequelizeDatabaseError') {
                throw CustomError.badRequest('¡El ambiente que intenta actualizar no existe!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteEnvironment(id: number) {
        try {
            await Environment.destroy({ where: { id } });
            return { message: '¡El ambiente se eliminó correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw CustomError.badRequest('¡El ambiente que intenta eliminar está relacionado con otros registros!');
            }
            if (error.name === 'SequelizeDatabaseError') {
                throw CustomError.badRequest('¡El ambiente que intenta eliminar no existe!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

}