import { CustomError } from '../../errors/custom.error';

export class TypeOfProjectEntity {
    constructor(
        public id: string,
        public name: string,
        public description?: string
    ) { }

    static fromObject(object: { [key: string]: any }): TypeOfProjectEntity {

        const { id, name, description } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');

        return new TypeOfProjectEntity(
            id,
            name,
            description
        );
    }
}