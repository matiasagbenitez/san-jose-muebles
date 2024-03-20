export class ReceptionTotalDto {
    private constructor(
        public id_purchase: number,
        public id_user: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, ReceptionTotalDto?] {
        const { id_purchase, id_user } = object;

        if (!id_purchase) return ['El identificador de la compra es requerido'];
        if (!id_user) return ['El identificador del usuario es requerido'];

        return [undefined, new ReceptionTotalDto(id_purchase, id_user)];
    }
}