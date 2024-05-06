export class CreateGroupDTO {
    private constructor(
        public id_function: number,
        public name: string,
        public status: 'ACTIVO' | 'INACTIVO' = 'ACTIVO'
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateGroupDTO?] {
        const { id_function, name } = object;

        if (!id_function) return ['El ID de la función es requerido'];
        if (!name) return ['El nombre de la función es requerido'];

        return [undefined, new CreateGroupDTO(id_function, name)];
    }
}