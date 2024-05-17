export class UpdateEstimateStatusDTO {
    private constructor(
        public status: 'NO_ENVIADO' | 'ENVIADO' | 'ACEPTADO' | 'RECHAZADO',
        public comment: string,
        public id_user: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateEstimateStatusDTO?] {
        const { status, comment, id_user } = object;

        if (!status) return ['El estado es requerido'];
        if (!comment) return ['El comentario es requerido'];
        if (!id_user) return ['El id del usuario es requerido'];

        return [undefined, new UpdateEstimateStatusDTO(
            status,
            comment,
            id_user,
        )];
    }
}