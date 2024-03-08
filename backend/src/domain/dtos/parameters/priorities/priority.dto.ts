export class PriorityDto {
    private constructor(
        public name: string,
        public color: string
    ) { }

    static create(object: { [key: string]: any }): [string?, PriorityDto?] {
        const { name, color } = object;

        if (!name) return ['El nombre es requerido'];
        if (!color) return ['El color es requerido'];

        return [undefined, new PriorityDto(name, color)];
    }
}