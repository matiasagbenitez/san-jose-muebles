// import { DayJsAdapter, MoneyAdapter } from '../../../config';
import { CustomError } from '../../errors/custom.error';

interface PurchaseInterface {
    date: string;
    currency: string;
    is_monetary: boolean;
    subtotal: number;
    discount: number;
    other_charges: number;
    total: number;
    paid_amount: number;
    credit_balance: number;
    payed_off: boolean;
    fully_stocked: boolean;
    nullified: boolean;
}

interface SupplierInterface {
    id: number;
    name: string;
    dni_cuit: string;
    phone: string;
    locality: string;
}

interface ItemInterface {
    id: number;
    quantity: number;
    unit: string;
    product: string;
    price: number;
    subtotal: number;
    actual_stocked?: number;
    fully_stocked?: boolean;
}

interface AuditInterface {
    created_by: string;
    created_at: string;
    nullified_by: string;
    nullified_date: string;
    nullified_reason: string;
}

export class DetailPurchaseEntity {
    constructor(
        public id: number,
        public purchase: PurchaseInterface,
        public supplier: SupplierInterface,
        public items: ItemInterface[],
        public audit: AuditInterface,
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

        const purchaseEntity: PurchaseInterface = {
            date,
            currency: currency.name + ' (' + currency.symbol + ')',
            is_monetary: currency.is_monetary,
            subtotal,
            discount,
            other_charges,
            total,
            paid_amount,
            credit_balance,
            payed_off,
            fully_stocked,
            nullified,
        };

        const supplierEntity: SupplierInterface = {
            id: supplier.id,
            name: supplier.name,
            dni_cuit: supplier.dni_cuit,
            phone: supplier.phone,
            locality: supplier.locality.name + ', ' + supplier.locality.province.name,
        };

        let itemsArray: ItemInterface[] = [];
        for (let i = 0; i < items.length; i++) {
            itemsArray.push({
                id: items[i].id,
                quantity: items[i].quantity,
                unit: items[i].product.unit.symbol,
                product: items[i].product.name,
                price: items[i].price,
                subtotal: items[i].subtotal,
                actual_stocked: items[i].actual_stocked,
                fully_stocked: items[i].fully_stocked,
            });
        }

        const auditEntity: AuditInterface = {
            created_by: creator.name,
            created_at: createdAt,
            nullified_by: nullifier.name,
            nullified_date: nullified_date,
            nullified_reason: nullified_reason,
        };

        return new DetailPurchaseEntity(
            id,
            purchaseEntity,
            supplierEntity,
            itemsArray,
            auditEntity
        );

    }
}