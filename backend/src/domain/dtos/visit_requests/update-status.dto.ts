export class UpdateVisitRequestStatusDTO {
    private constructor(
        public status: 'PENDIENTE' | 'PAUSADA' | 'REALIZADA' | 'CANCELADA',
        public comment: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateVisitRequestStatusDTO?] {
        const { status, comment } = object;

        if (!status) return ['El estado de la visita es requerido'];
        if (status !== 'PENDIENTE' && status !== 'PAUSADA' && status !== 'REALIZADA' && status !== 'CANCELADA') return ['El estado de la visita es inválido'];

        return [undefined, new UpdateVisitRequestStatusDTO(
            status,
            comment,
        )];
    }
}