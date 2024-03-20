import { DayJsAdapter, MoneyAdapter } from '../../../config';
import { CustomError } from '../../errors/custom.error';

export class ListablePurchaseEntity {
    constructor(
        public id: number,
        public created_at: string,
        public date: string,
        public supplier: string,
        public total: string,
        public fully_stocked: boolean,
        public nullified: boolean,
    ) { }

    static fromObject(object: { [key: string]: any }): ListablePurchaseEntity {
        const { id, date, supplier, currency, total, fully_stocked, nullified, createdAt } = object;

        if (!id) throw CustomError.badRequest('Falta el ID');
        if (!date) throw CustomError.badRequest('Falta la fecha de la compra');
        if (!supplier.name) throw CustomError.badRequest('Falta el nombre del proveedor');
        if (!total) throw CustomError.badRequest('Falta el total');
        if (fully_stocked === undefined) throw CustomError.badRequest('Falta el estado de stock');
        if (nullified === undefined) throw CustomError.badRequest('Falta el estado de anulación');
        if (!createdAt) throw CustomError.badRequest('Falta la fecha de creación');

        const date_formatted = DayJsAdapter.toDayMonthYear(date);
        const created_at_formatted = DayJsAdapter.toDayMonthYearHour(createdAt);
        const total_formated = MoneyAdapter.get(currency, total);

        return new ListablePurchaseEntity(
            id,
            created_at_formatted,
            date_formatted,
            supplier.name,
            total_formated,
            fully_stocked,
            nullified,
        );

    }
}