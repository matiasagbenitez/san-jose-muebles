export class RoleDto {
    private constructor(
        public name: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, RoleDto?] {
        const { name } = object;

        if (!name) return ['Missing name'];

        return [undefined, new RoleDto(name)];
    }
}