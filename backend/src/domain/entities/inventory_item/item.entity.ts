import { CustomError } from '../../errors/custom.error';

interface DataItem {
    id: number;
    category: string;
    brand: string;
    quantity: number;
    code: string;
    name: string;
    last_check: Date;
    last_check_by: string;
    is_retired: boolean;
}
interface RetiredItem {
    id: number;
    retired_at: Date;
    reason: string;
    retired_by: string;
}

interface UpdatedItem {
    id: number;
    updated_at: Date;
    prev_quantity: number;
    new_quantity: number;
    updated_by: string;
}
export class InventoryItemEntity {
    constructor(
        public data: DataItem,
        public updates?: UpdatedItem[],
        public retirements?: RetiredItem[],
    ) { }

    static fromObject(object: { [key: string]: any }): InventoryItemEntity {
        const { id, category, brand, quantity, code, name, last_check_at, user_check, is_retired, updates, retirements } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!category) throw CustomError.badRequest('Falta la categoría');
        if (!brand) throw CustomError.badRequest('Falta la marca');
        if (!quantity) throw CustomError.badRequest('Falta la cantidad');
        if (!code) throw CustomError.badRequest('Falta el código');
        if (!name) throw CustomError.badRequest('Falta el nombre');
        if (!last_check_at) throw CustomError.badRequest('Falta la última revisión');
        if (!user_check) throw CustomError.badRequest('Falta el revisor');
        if (is_retired === null) throw CustomError.badRequest('Falta el estado de retiro');

        const data: DataItem = {
            id,
            category: category.name,
            brand: brand.name,
            quantity,
            code,
            name,
            last_check: last_check_at,
            last_check_by: user_check.name,
            is_retired,
        };

        let updatesArray: UpdatedItem[] = [];
        if (updates) {
            updatesArray = updates.map((update: any) => ({
                id: update.id,
                updated_at: update.createdAt,
                prev_quantity: update.prev_quantity,
                new_quantity: update.new_quantity,
                updated_by: update.user_update.name,
            }));
        }

        let retirementsArray: RetiredItem[] = [];
        if (retirements) {
            retirementsArray = retirements.map((retirement: any) => ({
                id: retirement.id,
                retired_at: retirement.createdAt,
                reason: retirement.reason,
                retired_by: retirement.user_retired.name,
            }));
        }


        return new InventoryItemEntity(
            data,
            updatesArray,
            retirementsArray,
        );

    }
}