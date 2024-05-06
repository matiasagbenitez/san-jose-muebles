import { Op } from "sequelize";
import { Group, Member } from "../../database/mysql/models";
import { CustomError, ParamDto, ParamEntity, PaginationDto } from "../../domain";

export interface MemberFilters {
    name: string;
}

export class MemberService {

    public async getMembers() {
        const rows = await Member.findAll();
        const entities = rows.map(row => ParamEntity.fromObject(row));
        return { items: entities };
    }

    public async getMembersPaginated(paginationDto: PaginationDto, filters: MemberFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [rows, total] = await Promise.all([
            Member.findAll({ where, offset: (page - 1) * limit, limit }),
            Member.count({ where })
        ]);
        const entities = rows.map(row => ParamEntity.fromObject(row));
        return { items: entities, total_items: total };
    }

    public async getMember(id: number) {
        const row = await Member.findByPk(id);
        if (!row) throw CustomError.notFound('¡El miembro solicitado no existe!');
        const { ...entity } = ParamEntity.fromObject(row);
        return { row: entity };
    }

    public async createMember(dto: ParamDto) {
        try {
            await Member.create({ ...dto });
            return { message: '¡El miembro se creó correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡El miembro que intenta crear ya existe!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateMember(id: number, dto: ParamDto) {
        try {
            await Member.update({ ...dto }, { where: { id } });
            return { message: '¡El miembro se actualizó correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡El miembro que intenta actualizar ya existe!');
            }
            if (error.name === 'SequelizeDatabaseError') {
                throw CustomError.badRequest('¡El miembro que intenta actualizar no existe!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteMember(id: number) {
        try {
            await Member.destroy({ where: { id } });
            return { message: '¡El miembro se eliminó correctamente!' };
        } catch (error: any) {
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                throw CustomError.badRequest('¡El miembro que intenta eliminar está relacionado con otros registros!');
            }
            if (error.name === 'SequelizeDatabaseError') {
                throw CustomError.badRequest('¡El miembro que intenta eliminar no existe!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

}