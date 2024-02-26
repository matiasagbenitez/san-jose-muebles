export class RoleUserDto {
    private constructor(
        public id_role: number,
        public id_user: number,
    ) { }

    static create(object: { [key: string]: any }): [string?, RoleUserDto?] {
        const { id_role, id_user } = object;

        if (!id_role) return ['Missing id_role'];
        if (!id_user) return ['Missing id_user'];

        return [undefined, new RoleUserDto(id_role, id_user)];
    }
}