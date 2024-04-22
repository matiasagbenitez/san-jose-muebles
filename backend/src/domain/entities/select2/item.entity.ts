import { CustomError } from '../../errors/custom.error';

export class Select2ItemEntity {
    constructor(
        public id: number,
        public label: string,
    ) { }

    static fromObject(object: { [key: string]: any }): Select2ItemEntity {
        const { id, name } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre del item');

        return new Select2ItemEntity(
            id,
            name,
        );

    }
}