import { CustomError } from '../../errors/custom.error';

export class VisitReasonEntity {
    constructor(
        public id: string,
        public name: string,    
        public color: string,
    ) { }

    static fromObject(object: { [key: string]: any }): VisitReasonEntity {

        const { id, name, color } = object;

        if (!id) throw CustomError.badRequest('Missing id');
        if (!name) throw CustomError.badRequest('Missing name');
        if (!color) throw CustomError.badRequest('Missing color');

        return new VisitReasonEntity(
            id,
            name,
            color,
        );
    }
}