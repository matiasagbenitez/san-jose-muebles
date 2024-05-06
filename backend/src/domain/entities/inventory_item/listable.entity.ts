import { CustomError } from '../../errors/custom.error';

export class ListableInventoryItemEntity {
    constructor(
        public id: number,
        public category: string,
        public brand: string,
        public code: string,
        public name: string,
        public status: 'RESERVADO' | 'OPERATIVO' | 'RETIRADO' | 'DESCARTADO',
    ) { }

    static fromObject(object: { [key: string]: any }): ListableInventoryItemEntity {
        const { id, category, brand, code, name, status } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!category) throw CustomError.badRequest('Falta la categoría');
        if (!brand) throw CustomError.badRequest('Falta la marca');
        if (!code) throw CustomError.badRequest('Falta el código');
        if (!name) throw CustomError.badRequest('Falta el nombre');
        if (!status) throw CustomError.badRequest('Falta el estado');

        return new ListableInventoryItemEntity(
            id,
            category.name,
            brand.name,
            code,
            name,
            status,
        );

    }
}