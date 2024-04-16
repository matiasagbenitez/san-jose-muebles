import { CustomError } from '../../errors/custom.error';

export class InventoryItemEntity {
    constructor(
        public id: number,
        public category: string,
        public brand: string,
        public code: string,
        public name: string,
        public last_check: Date,
        public last_check_by: string,
        public is_retired: boolean,
        public retired_at?: Date,
        public retired_reason?: string,
        public retired_by?: string,
    ) { }

    static fromObject(object: { [key: string]: any }): InventoryItemEntity {
        const { id, category, brand, code, name, last_check, checker, is_retired, retirement } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!category) throw CustomError.badRequest('Falta la categoría');
        if (!brand) throw CustomError.badRequest('Falta la marca');
        if (!code) throw CustomError.badRequest('Falta el código');
        if (!name) throw CustomError.badRequest('Falta el nombre');
        if (!last_check) throw CustomError.badRequest('Falta la última revisión');
        if (!checker) throw CustomError.badRequest('Falta el revisor');
        if (!is_retired) throw CustomError.badRequest('Falta el estado de retiro');

        return new InventoryItemEntity(
            id,
            category,
            brand,
            code,
            name,
            last_check,
            checker.name,
            is_retired,
            retirement?.createdAt,
            retirement?.reason,
            retirement?.retirer.name,
        );

    }
}