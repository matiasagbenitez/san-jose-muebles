export class NameDto {
    private constructor(
        public name: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, NameDto?] {
        const { name } = object;

        if (!name) return ['El nombre es requerido'];

        return [undefined, new NameDto(name)];
    }
}