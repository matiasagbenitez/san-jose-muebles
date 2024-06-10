export class CreateProjectEvolutionDTO {
    private constructor(
        public status: string,
        public comment: string,
        public id_user: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateProjectEvolutionDTO?] {
        const { status, reason, id_user } = object;

        if (!status) return ['El estado es necesario'];
        // if (!reason) return ['El comentario es necesario'];
        if (!id_user) return ['El ID del usuario es necesario'];

        return [undefined, new CreateProjectEvolutionDTO(status, reason, id_user)];
    }
}