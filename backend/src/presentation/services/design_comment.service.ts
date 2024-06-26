import { DesignComment } from "../../database/mysql/models";
import { CustomError, CreateDesignCommentDTO, DesignCommentEntity, PaginationDto } from "../../domain";

export class DesignCommentService {

    public async getDesignCommentsPaginated(id_design: number, paginationDto: PaginationDto) {
        const { page, limit } = paginationDto;
        const [rows, total] = await Promise.all([
            DesignComment.findAll({ where: { id_design }, include: { association: 'user', attributes: ['name'] }, offset: (page - 1) * limit, limit, order: [['createdAt', 'DESC']] }),
            DesignComment.count({ where: { id_design } })
        ]);
        const entities = rows.map(item => DesignCommentEntity.fromObject(item));
        return { items: entities, total_items: total };
    }

    public async createDesignComment(id_design: number, dto: CreateDesignCommentDTO) {
        try {
            const comment = await DesignComment.create({ id_design, ...dto });
            const row = await DesignComment.findByPk(comment.id, { include: { association: 'user', attributes: ['name'] } });
            if (!row) throw CustomError.internalServerError('¡Error al crear el comentario!');

            const { ...entity } = DesignCommentEntity.fromObject(row);
            return { item: entity, message: '¡Comentario creado correctamente!' };
        } catch (error: any) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteDesignComment(id_design: number, id_comment: number, id_user: number) {
        try {
            const comment = await DesignComment.findOne({ where: { id: id_comment, id_design, id_user } });
            if (!comment) throw CustomError.notFound('¡Comentario no encontrado o permisos insuficientes!');
            await comment.destroy();
            return { ok: true, message: '¡Comentario eliminado correctamente!' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}