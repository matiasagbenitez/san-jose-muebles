import { CustomError } from '../errors/custom.error';

export class BankEntity {
    constructor(
        public id: string,
        public name: string,
    ) { }

    static fromObject(object: { [key: string]: any }): BankEntity {

        const { id, name } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');

        return new BankEntity(
            id,
            name,
        );
    }
}