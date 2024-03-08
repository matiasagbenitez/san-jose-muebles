import { CustomError } from '../../errors/custom.error';

export class TypeOfEnvironmentEntity {
    constructor(
        public id: string,
        public name: string,
    ) { }

    static fromObject(object: { [key: string]: any }): TypeOfEnvironmentEntity {

        const { id, name } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');

        return new TypeOfEnvironmentEntity(
            id,
            name,
        );
    }
}