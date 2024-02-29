export class TypeOfEnvironmentDto {
    private constructor(
        public name: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, TypeOfEnvironmentDto?] {
        const { name } = object;

        if (!name) return ['El nombre es requerido'];

        return [undefined, new TypeOfEnvironmentDto(name)];
    }
}