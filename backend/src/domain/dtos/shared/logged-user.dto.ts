export class LoggedUserDto {
    private constructor(
        public id_user: number,
        public name: string,
        public username: string,
        public roles: string[],
    ) { }

    static create(object: { [key: string]: any }): [string?, LoggedUserDto?] {
        const { id_user, name, username, roles } = object;

        if (!id_user) return ['El id del usuario es requerido'];
        if (!name) return ['El nombre del usuario es requerido'];
        if (!username) return ['El usuario es requerido'];
        if (!roles) return ['Los roles del usuario son requeridos'];

        return [undefined, new LoggedUserDto(
            id_user,
            name,
            username,
            roles,
        )];
    }
}