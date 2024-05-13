import { CustomError } from '../../errors/custom.error';

export class RelatedPersonEntity {
    constructor(
        public id: number,
        public name: string,
        public phone: string,
        public relation: string,
        public annotations: string,
    ) { }

    static fromObject(object: { [key: string]: any }): RelatedPersonEntity {

        const { id, name, phone, relation, annotations } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!name) throw CustomError.badRequest('Falta el nombre');

        return new RelatedPersonEntity(
            id,
            name,
            phone,
            relation,
            annotations,
        );
    }
}