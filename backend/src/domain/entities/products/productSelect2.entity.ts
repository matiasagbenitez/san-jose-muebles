import { CustomError } from '../../errors/custom.error';

export class ProductSelect2Entity {
    constructor(
        public id: number,
        public label: string,
        public stock: string,
    ) { }

    static fromObject(object: { [key: string]: any }): ProductSelect2Entity {
        const { id, brand, name, code, actual_stock, unit } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!brand) throw CustomError.badRequest('Falta la marca');
        if (!name) throw CustomError.badRequest('Falta el nombre');
        if (!actual_stock) throw CustomError.badRequest('Falta el stock');
        if (!unit) throw CustomError.badRequest('Falta la unidad');

        const stock = `${Number(actual_stock)} ${unit.symbol}`;

        return new ProductSelect2Entity(
            id,
            `${name} | MARCA: ${brand.name} ${code ? ` | CÓDIGO: ${code}` : ''}`,
            stock
        );

    }
}