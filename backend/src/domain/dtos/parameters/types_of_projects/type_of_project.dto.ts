export class TypeOfProjectDto {
    private constructor(
        public name: string,
        public description: string
    ) { }

    static create(object: { [key: string]: any }): [string?, TypeOfProjectDto?] {
        const { name, description } = object;

        if (!name) return ['El nombre es requerido'];

        return [undefined, new TypeOfProjectDto(name, description)];
    }
}