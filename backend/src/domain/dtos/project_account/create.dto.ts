export class CreateProjectAccountDTO {
    private constructor(
        public id_project: number,
        public id_currency: number,
        public balance: number = 0
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateProjectAccountDTO?] {
        const { id_project, id_currency } = object;

        if (!id_project) return ['El identificador del proyecto es requerido'];
        if (!id_currency) return ['El identificador de la moneda es requerido'];

        return [undefined, new CreateProjectAccountDTO(id_project, id_currency)];
    }
}