import { CustomError } from '../../errors/custom.error';

interface SupplierInterface {
    id: number;
    name: string;
    locality: string;
}

interface ResumeInterface {
    date: string;
    supplier: SupplierInterface;
    currency: string;
    is_monetary: boolean;
    total: number;
    created_at: string;
    created_by: string;
}

interface ItemInterface {
    id: number;
    quantity: number;
    unit: string;
    brand: string;
    product: string;
    price: number;
    subtotal: number;
    actual_stocked: number;
    fully_stocked: boolean;
}

interface TotalsInterface {
    currency: string;
    is_monetary: boolean;
    subtotal: number;
    discount: number;
    other_charges: number;
    total: number;
}

interface NullationInterface {
    by: string;
    at: string;
    reason: string;
}
export class DetailPurchaseEntity {
    constructor(
        public id: number,
        public status: 'VALIDA' | 'ANULADA',
        public fully_stocked: boolean,
        public resume: ResumeInterface,
        public items: ItemInterface[],
        public totals: TotalsInterface,
        public nullation: NullationInterface | null,
    ) { }

    static fromObject(object: { [key: string]: any }): DetailPurchaseEntity {
        const {
            id,
            status,
            date,

            supplier,
            currency,
            subtotal,
            discount,
            other_charges,
            total,

            fully_stocked,
            items,

            user,
            createdAt,

            nullation,
        } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!status) throw CustomError.badRequest('Falta el estado');
        if (!date) throw CustomError.badRequest('Falta la fecha');

        if (!supplier) throw CustomError.badRequest('Falta el proveedor');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!subtotal) throw CustomError.badRequest('Falta el subtotal');
        if (!discount) throw CustomError.badRequest('Falta el descuento');
        if (!other_charges) throw CustomError.badRequest('Faltan otros cargos');
        if (!total) throw CustomError.badRequest('Falta el total');
        if (fully_stocked === undefined) throw CustomError.badRequest('Falta si está completamente abastecido');

        if (!items) throw CustomError.badRequest('Faltan los ítems');

        if (!user) throw CustomError.badRequest('Falta el creador');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        const supplierEntity: SupplierInterface = {
            id: supplier.id,
            name: supplier.name,
            locality: supplier.locality.name + ', ' + supplier.locality.province.name,
        };

        const data: ResumeInterface = {
            date,
            supplier: supplierEntity,
            currency: currency.name + ' (' + currency.symbol + ')',
            is_monetary: currency.is_monetary,
            total,
            created_at: createdAt,
            created_by: user.name,
        };

        let itemsArray: ItemInterface[] = [];
        for (const item of items) {
            itemsArray.push({
                id: item.id,
                quantity: Number(item.quantity),
                unit: item.product.unit.symbol,
                brand: item.product.brand.name,
                product: item.product.name,
                price: item.price,
                subtotal: item.subtotal,
                actual_stocked: Number(item.actual_stocked),
                fully_stocked: item.fully_stocked,
            });
        }

        const totals: TotalsInterface = {
            currency: currency.name + ' (' + currency.symbol + ')',
            is_monetary: currency.is_monetary,
            subtotal,
            discount,
            other_charges,
            total,
        };

        let nullationData : NullationInterface | null = null;
        if (nullation) {
            const { user, createdAt, reason } = nullation;
            if (!user) throw CustomError.badRequest('Falta el anulador');
            if (!createdAt) throw CustomError.badRequest('Falta la fecha de anulación');
            if (!reason) throw CustomError.badRequest('Falta la razón de la anulación');
            nullationData = {
                by: user.name,
                at: createdAt,
                reason,
            };
        }

        return new DetailPurchaseEntity(
            id,
            status,
            fully_stocked,
            data,
            itemsArray,
            totals,
            nullationData,
        );
    }
}