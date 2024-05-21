import { CustomError } from '../../errors/custom.error';

export class EntityBasicEntity {
    constructor(
        public id: string,
        public name: string,
        public locality: string,
    ) { }

    static fromObject(object: { [key: string]: any }): EntityBasicEntity {
        const { id, name, locality } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre');
        if (!locality) throw CustomError.badRequest('Falta la localidad');

        return new EntityBasicEntity(
            id,
            name,
            locality.name
        );
    }
}