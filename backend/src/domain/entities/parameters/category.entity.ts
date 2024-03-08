import { CustomError } from '../../errors/custom.error';

export class CategoryEntity {
    constructor(
        public id: string,
        public name: string,
    ) { }

    static fromObject(object: { [key: string]: any }): CategoryEntity {

        const { id, name } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');

        return new CategoryEntity(
            id,
            name,
        );
    }
}