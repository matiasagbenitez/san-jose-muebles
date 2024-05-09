import { CustomError } from '../../errors/custom.error';

export class ClientSelectEntity {
    constructor(
        public id: string,
        public label: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ClientSelectEntity {
        const { id, name, last_name } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre del cliente');
        if (!last_name) throw CustomError.badRequest('Falta el apellido del cliente');

        return new ClientSelectEntity(
            id,
            last_name + ' ' + name,
        );
    }
}