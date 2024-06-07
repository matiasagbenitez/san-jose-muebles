export class CreateDesignTaskDTO {
    private constructor(
        public status: "PENDIENTE" | "PROCESO" | "FINALIZADA" | "ARCHIVADA" = "PENDIENTE",
        public title: string,
        public description: string,
        public id_user: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateDesignTaskDTO?] {
        const { status = 'PENDIENTE', title, description, id_user } = object;

        if (!status) return ['El estado es necesario'];
        if (!title) return ['El título es necesario'];
        if (!id_user) return ['El ID del usuario es necesario'];

        return [undefined, new CreateDesignTaskDTO(status, title, description, id_user)];
    }
}