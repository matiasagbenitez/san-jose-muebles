// import { DayJsAdapter, MoneyAdapter } from '../../../config';
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
    paid_amount: number;
    credit_balance: number;
    payed_off: boolean;
    created_at: string;
    created_by: string;
    nullified: boolean;
    nullified_by: string;
    nullified_date: string;
    nullified_reason: string;
}
interface ItemInterface {
    id: number;
    quantity: number;
    unit: string;
    brand: string;
    product: string;
    price: number;
    subtotal: number;
    actual_stocked?: number;
    fully_stocked?: boolean;
}

interface DetailInterface {
    items: ItemInterface[];
    currency: string;
    is_monetary: boolean;
    subtotal: number;
    discount: number;
    other_charges: number;
    total: number;
}
export class DetailPurchaseEntity {
    constructor(
        public id: number,
        public resume: ResumeInterface,
        public detail: DetailInterface
    ) { }

    static fromObject(object: { [key: string]: any }): DetailPurchaseEntity {
        const {
            id,
            date,
            supplier,
            creator,
            createdAt,
            currency,
            subtotal,
            discount,
            other_charges,
            total,
            paid_amount,
            credit_balance,
            payed_off,
            fully_stocked,
            nullified,
            nullifier,
            nullified_date,
            nullified_reason,
            items
        } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!date) throw CustomError.badRequest('Falta la fecha');
        if (!supplier) throw CustomError.badRequest('Falta el proveedor');
        if (!creator) throw CustomError.badRequest('Falta el creador');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');
        if (!currency) throw CustomError.badRequest('Falta la moneda');
        if (!subtotal) throw CustomError.badRequest('Falta el subtotal');
        if (!discount) throw CustomError.badRequest('Falta el descuento');
        if (!other_charges) throw CustomError.badRequest('Faltan otros cargos');
        if (!total) throw CustomError.badRequest('Falta el total');
        if (!paid_amount) throw CustomError.badRequest('Falta el monto pagado');
        if (!credit_balance) throw CustomError.badRequest('Falta el saldo deudor');
        if (payed_off === undefined) throw CustomError.badRequest('Falta si está pagado');
        if (fully_stocked === undefined) throw CustomError.badRequest('Falta si está completamente abastecido');
        if (nullified === undefined) throw CustomError.badRequest('Falta si está anulado');
        if (!nullifier) throw CustomError.badRequest('Falta el anulador');
        if (!items) throw CustomError.badRequest('Faltan los ítems');

        const supplierEntity: SupplierInterface = {
            id: supplier.id,
            name: supplier.name,
            locality: supplier.locality.name + ', ' + supplier.locality.province.name,
        };

        let itemsArray: ItemInterface[] = [];
        for (let i = 0; i < items.length; i++) {
            itemsArray.push({
                id: items[i].id,
                quantity: items[i].quantity,
                unit: items[i].product.unit.symbol,
                brand: items[i].product.brand.name,
                product: items[i].product.name,
                price: items[i].price,
                subtotal: items[i].subtotal,
                actual_stocked: items[i].actual_stocked,
                fully_stocked: items[i].fully_stocked,
            });
        }

        const detail: DetailInterface = {
            items: itemsArray,
            currency: currency.name + ' (' + currency.symbol + ')',
            is_monetary: currency.is_monetary,
            subtotal: subtotal,
            discount: discount,
            other_charges: other_charges,
            total: total,
        };

        const resume: ResumeInterface = {
            date,
            supplier: supplierEntity,
            currency: currency.name + ' (' + currency.symbol + ')',
            is_monetary: currency.is_monetary,
            total,
            paid_amount,
            credit_balance,
            payed_off,
            created_at: createdAt,
            created_by: creator.name,
            nullified,
            nullified_by: nullifier.name,
            nullified_date,
            nullified_reason,
        };

        return new DetailPurchaseEntity(
            id,
            resume,
            detail
        );

    }
}