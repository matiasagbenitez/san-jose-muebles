export class UpdateVisitRequestStatusDTO {
    private constructor(
        public status: 'PENDIENTE' | 'REALIZADA' | 'CANCELADA',
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateVisitRequestStatusDTO?] {
        const { status } = object;

        if (!status) return ['El estado de la visita es requerido'];
        if (status !== 'PENDIENTE' && status !== 'REALIZADA' && status !== 'CANCELADA') return ['El estado de la visita es inválido'];

        return [undefined, new UpdateVisitRequestStatusDTO(
            status,
        )];
    }
}