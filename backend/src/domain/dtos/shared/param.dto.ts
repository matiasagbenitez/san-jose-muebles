export class ParamDto {
    private constructor(
        public name: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, ParamDto?] {
        const { name } = object;

        if (!name) return ['El nombre del parámetro es requerido'];

        return [undefined, new ParamDto(name)];
    }
}