import { CustomError } from '../../errors/custom.error';

export class PurchaseEntity {
    constructor(
        public id: string,                  // TABLE

        public created_by: number,          // TABLE  
        public created_user: string,

        public id_supplier: number,         // TABLE
        public supplier_name: string,

        public date: string,                // TABLE

        public id_currency: number,         // TABLE
        public currency: string,

        public subtotal: string,            // TABLE
        public discount: string,            // TABLE
        public total: string,               // TABLE
        public fully_stocked: boolean,      // TABLE

        public nullified: boolean,          // TABLE
        public nullified_by: number,        // TABLE
        public nullified_user: string,
        public nullified_date: string,      // TABLE
        public nullified_reason: string,    // TABLE
    ) { }

    static fromObject(object: { [key: string]: any }): PurchaseEntity {
        const {
            id,
            created_by,
            user,
            id_supplier,
            supplier,
            date,
            id_currency,
            currency,
            subtotal,
            discount,
            total,
            fully_stocked,
            nullified,
            nullified_by,
            nullified_user,
            nullified_date,
            nullified_reason
        } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!created_by) throw CustomError.badRequest('Falta el ID del creador');
        if (!user) throw CustomError.badRequest('Falta el usuario');
        if (!id_supplier) throw CustomError.badRequest('Falta el ID del proveedor');
        if (!supplier) throw CustomError.badRequest('Falta el nombre del proveedor');
        if (!date) throw CustomError.badRequest('Falta la fecha');
        if (!id_currency) throw CustomError.badRequest('Falta el ID de la moneda');
        if (!currency) throw CustomError.badRequest('Falta el nombre de la moneda');
        if (isNaN(subtotal)) throw CustomError.badRequest('El subtotal debe ser un número');
        if (isNaN(discount)) throw CustomError.badRequest('El descuento debe ser un número');
        if (isNaN(total)) throw CustomError.badRequest('El total debe ser un número');
        if (fully_stocked === undefined) throw CustomError.badRequest('Falta el estado de stock');
        if (nullified === undefined) throw CustomError.badRequest('Falta el estado de anulado');
        if (!nullified_by) throw CustomError.badRequest('Falta el ID del anulador');
        if (!nullified_user) throw CustomError.badRequest('Falta el usuario del anulador');
        if (!nullified_date) throw CustomError.badRequest('Falta la fecha de anulación');
        if (!nullified_reason) throw CustomError.badRequest('Falta la razón de anulación');


        const subtotal_f = Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(subtotal);
        const discount_f = Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(discount);
        const total_f = Intl.NumberFormat('es-ES', { minimumFractionDigits: 2 }).format(total);

        return new PurchaseEntity(
            id,
            created_by,
            user,
            id_supplier,
            supplier,
            date,
            id_currency,
            currency,
            subtotal_f,
            discount_f,
            total_f,
            fully_stocked,
            nullified,
            nullified_by,
            nullified_user,
            nullified_date,
            nullified_reason
        );
    }
}