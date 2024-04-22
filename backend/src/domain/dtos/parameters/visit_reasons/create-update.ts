export class VisitReasonDTO {
    private constructor(
        public name: string,
        public color: string
    ) { }

    static create(object: { [key: string]: any }): [string?, VisitReasonDTO?] {
        const { name, color } = object;

        if (!name) return ['El nombre es requerido'];
        if (!color) return ['El color es requerido'];

        return [undefined, new VisitReasonDTO(name, color)];
    }
}