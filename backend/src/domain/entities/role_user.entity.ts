import { CustomError } from '../errors/custom.error';

export class RoleUserEntity {
    constructor(
        public id: string,
        public id_role: number,
        public id_user: number,
    ) { }

    static fromObject(object: { [key: string]: any }): RoleUserEntity {

        const { id, id_role, id_user } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!id_role) throw CustomError.badRequest('Missing id_role');
        if (!id_user) throw CustomError.badRequest('Missing id_user');

        return new RoleUserEntity(
            id,
            id_role,
            id_user,
        );
    }
}