import { CustomError } from '../../errors/custom.error';

interface DataItem {
    id: number;
    category: string;
    brand: string;
    code: number;
    name: string;
    status: 'RESERVADO' | 'OPERATIVO' | 'RETIRADO' | 'DESCARTADO';
    evolutions: EvolutionItem[] | [];
}

interface EditableItem {
    id_inventory_categ: number;
    id_inventory_brand: number;
    name: string;
}

interface EvolutionItem {
    id: number;
    status: 'RESERVADO' | 'OPERATIVO' | 'RETIRADO' | 'DESCARTADO';
    comment: string;
    user: string;
    at: Date;
}

export class InventoryItemEntity {
    constructor(
        public editable_fields: EditableItem,
        public data: DataItem,
    ) { }

    static fromObject(object: { [key: string]: any }): InventoryItemEntity {
        const { id, brand, category, code, name, status, evolutions } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!category) throw CustomError.badRequest('Falta la categoría');
        if (!brand) throw CustomError.badRequest('Falta la marca');
        if (!code) throw CustomError.badRequest('Falta el código');
        if (!name) throw CustomError.badRequest('Falta el nombre');

        const editable: EditableItem = {
            id_inventory_categ: category.id,
            id_inventory_brand: brand.id,
            name,
        };

        let evolutionsArray: EvolutionItem[] = [];
        if (evolutions) {
            evolutionsArray = evolutions.map((update: any) => ({
                id: update.id,
                status: update.status,
                comment: update.comment,
                user: update.user.name,
                at: update.createdAt,
            }));
        }

        const data: DataItem = {
            id,
            category: category.name,
            brand: brand.name,
            code,
            name,
            status,
            evolutions: evolutionsArray,
        };


        return new InventoryItemEntity(
            editable,
            data,
        );

    }
}