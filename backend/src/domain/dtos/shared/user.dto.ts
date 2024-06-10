export class UserDTO {
    private constructor(
        public id: number,
        public username: string,
        public roles: string[],
    ) { }

    static create(object: { [key: string]: any }): [string?, UserDTO?] {
        
        const { id_user, username, roles } = object;

        if (!id_user) return ['El id del usuario es requerido'];
        if (!username) return ['El usuario es requerido'];
        if (!roles) return ['Los roles del usuario son requeridos'];

        return [undefined, new UserDTO(
            id_user,
            username,
            roles,
        )];
    }
}