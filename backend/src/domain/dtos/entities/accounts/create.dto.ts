export class CreateEntityAccountDTO {
    private constructor(
        public id_entity: number,
        public id_currency: number,
        public balance: number = 0
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateEntityAccountDTO?] {
        const { id_entity, id_currency } = object;

        if (!id_entity) return ['El identificador de la entidad es requerido'];
        if (!id_currency) return ['El identificador de la moneda es requerido'];

        return [undefined, new CreateEntityAccountDTO(id_entity, id_currency)];
    }
}