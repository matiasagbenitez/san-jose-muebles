import { CustomError } from '../../errors/custom.error';

export class UnitOfMeasureEntity {
    constructor(
        public id: string,
        public name: string,
        public symbol: string,
    ) { }

    static fromObject(object: { [key: string]: any }): UnitOfMeasureEntity {

        const { id, name, symbol } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!symbol) throw CustomError.badRequest('Missing symbol');

        return new UnitOfMeasureEntity(
            id,
            name,
            symbol,
        );
    }
}