import { Environment } from "../../database/mysql/models";
import { CustomError, CreateEnvironmentDTO, EnvironmentsByProjectEntity, PaginationDto, EnvironmentsListEntity } from "../../domain";

type Status = "PENDIENTE" | "PROCESO" | "PAUSADO" | "FINALIZADO" | "CANCELADO";
export interface EnvironmentFilters {
    des_status: Status;
    fab_status: Status;
    ins_status: Status;
    id_client: number;
}

export class EnvironmentService {

    public async getEnvironmentsByProjectPaginated(id_project: number, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;

        const [rows, total] = await Promise.all([
            Environment.findAll({ where: { id_project }, include: [{ association: 'type' }], offset: (page - 1) * limit, limit }),
            Environment.count({ where: { id_project } })
        ]);
        const entities = rows.map(row => EnvironmentsByProjectEntity.fromObject(row));
        return { items: entities, total_items: total };
    }

    public async getAllPaginated(paginationDto: PaginationDto, filters: EnvironmentFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.des_status) where = { ...where, des_status: filters.des_status };
        if (filters.fab_status) where = { ...where, fab_status: filters.fab_status };
        if (filters.ins_status) where = { ...where, ins_status: filters.ins_status };

        const include = [
            { association: 'type', attributes: ['id', 'name'] },
            {
                association: 'project',
                attributes: ['id', 'title'],
                where: filters.id_client ? { id_client: filters.id_client } : undefined,
                include: [{ association: 'client', attributes: ['id', 'name', 'last_name'] }]
            }
        ];

        const [rows, total] = await Promise.all([
            Environment.findAll({
                where,
                include,
                offset: (page - 1) * limit,
                limit
            }),
            Environment.count({
                where,
                include: [
                    {
                        association: 'project',
                        where: filters.id_client ? { id_client: filters.id_client } : undefined
                    }
                ]
            })
        ]);

        const entities = rows.map(row => EnvironmentsListEntity.fromObject(row));
        return { items: entities, total_items: total };
    }

    public async getEnvironment(id: number) {
        const row = await Environment.findByPk(id);
        if (!row) throw CustomError.notFound('¡El ambiente solicitado no existe!');
        return { row };
    }

    public async createEnvironment(dto: CreateEnvironmentDTO) {
        try {
            await Environment.create({ ...dto });
            return { message: '¡El ambiente se creó correctamente!' };
        } catch (error: any) {
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