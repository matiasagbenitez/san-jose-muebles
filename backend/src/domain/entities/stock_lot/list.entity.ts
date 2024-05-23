import { CustomError } from '../../errors/custom.error';

export class StockLotListEntity {
    private constructor(
        public id: number,
        public type: 'INCREMENT' | 'DECREMENT',
        public description: string,
        public total_items: number,
        public username: string,
        public created_at: Date,
    ) { }

    static fromObject(object: { [key: string]: any }): StockLotListEntity {
        const { id, type, description, total_items, user, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!type) throw CustomError.badRequest('Falta el tipo de ajuste');
        if (type !== 'INCREMENT' && type !== 'DECREMENT') throw CustomError.badRequest('El tipo de ajuste no es válido');
        if (!description) throw CustomError.badRequest('Falta la descripción');
        if (!total_items) throw CustomError.badRequest('Falta el total de ítems');
        if (!user) throw CustomError.badRequest('Falta el usuario');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación')

        return new StockLotListEntity(
            id,
            type,
            description,
            total_items,
            user.name,
            createdAt,
        );
    }
}