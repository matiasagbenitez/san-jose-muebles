export class CreateDesignCommentDTO {
    private constructor(
        public comment: string,
        public id_user: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateDesignCommentDTO?] {
        const { comment, id_user } = object;

        if (!comment) return ['El comentario es necesario'];
        if (typeof comment !== 'string') return ['El comentario debe ser una cadena de texto'];
        if (!id_user) return ['El ID del usuario es necesario'];

        return [undefined, new CreateDesignCommentDTO(comment, id_user)];
    }
}