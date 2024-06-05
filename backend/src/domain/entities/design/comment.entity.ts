import { CustomError } from '../../errors/custom.error';

export class DesignCommentEntity {
    constructor(
        public id: string,
        public comment: string,
        public user: string,
        public createdAt: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): DesignCommentEntity {
        const { id, comment, user, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!comment) throw CustomError.badRequest('Falta el comentario');
        if (!user) throw CustomError.badRequest('Falta el usuario');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        return new DesignCommentEntity(
            id,
            comment,
            user,
            createdAt,
        );
    }
}