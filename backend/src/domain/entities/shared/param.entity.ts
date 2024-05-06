import { CustomError } from '../../errors/custom.error';

export class ParamEntity {
    constructor(
        public id: number,
        public name: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ParamEntity {
        const { id, name } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre del parámetro');

        return new ParamEntity(id, name);
    }
}