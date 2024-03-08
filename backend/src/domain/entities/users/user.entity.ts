import { CustomError } from '../../errors/custom.error';

export class UserEntity {
    constructor(
        public id: string,
        public name: string,
        public username: string,
        public email: string,
        public password: string,
        public phone?: string,
        public roles?: string[],
    ) { }

    static fromObject(object: { [key: string]: any }): UserEntity {

        const { id, name, username, email, password, phone, roles } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!username) throw CustomError.badRequest('Missing username');
        if (!email) throw CustomError.badRequest('Missing email');
        if (!password) throw CustomError.badRequest('Missing password');

        let userRoles: string[] = [];
        if (roles) {
            userRoles = roles.map((role: { name: string }) => role.name);
        }

        return new UserEntity(
            id,
            name,
            username,
            email,
            password,
            phone,
            userRoles,
        );
    }
}