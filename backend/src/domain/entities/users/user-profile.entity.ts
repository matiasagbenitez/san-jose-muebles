import { CustomError } from '../../errors/custom.error';

interface Role {
    id: string;
    name: string;
}

export class UserProfileEntity {
    constructor(
        public id: string,
        public name: string,
        public username: string,
        public email: string,
        public phone: string,
        public roles: Role[],
    ) { }

    static fromObject(object: { [key: string]: any }): UserProfileEntity {

        const { id, name, username, email, phone, roles } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!username) throw CustomError.badRequest('Missing username');
        if (!email) throw CustomError.badRequest('Missing email');

        const rolesArray = [];
        if (roles) {
            if (!Array.isArray(roles)) throw CustomError.badRequest('Roles must be an array');
            for (const role of roles) {
                if (!role.id) throw CustomError.badRequest('Role id is required');
                if (!role.name) throw CustomError.badRequest('Role name is required');
                rolesArray.push({
                    id: role.id,
                    name: role.name,
                });
            }
        }

        return new UserProfileEntity(
            id,
            name,
            username,
            email,
            phone,
            rolesArray,
        );
    }
}