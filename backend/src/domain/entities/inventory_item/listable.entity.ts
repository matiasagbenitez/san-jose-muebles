import { CustomError } from '../../errors/custom.error';

export class ListableInventoryItemEntity {
    constructor(
        public id: number,
        public category: string,
        public brand: string,
        public quantity: number,
        public code: string,
        public name: string,
        public last_check_at: Date,
        public last_check_by: string,
        public is_retired: boolean,
    ) { }

    static fromObject(object: { [key: string]: any }): ListableInventoryItemEntity {
        const { id, category, brand, quantity, code, name, last_check_at, user_check, is_retired } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!category) throw CustomError.badRequest('Falta la categoría');
        if (!brand) throw CustomError.badRequest('Falta la marca');
        if (!quantity) throw CustomError.badRequest('Falta la cantidad');
        if (!code) throw CustomError.badRequest('Falta el código');
        if (!name) throw CustomError.badRequest('Falta el nombre');
        if (!last_check_at) throw CustomError.badRequest('Falta la fecha de última revisión');
        if (!user_check) throw CustomError.badRequest('Falta el revisor');

        return new ListableInventoryItemEntity(
            id,
            category.name,
            brand.name,
            quantity,
            code,
            name,
            last_check_at,
            user_check.name,
            is_retired,
        );

    }
}