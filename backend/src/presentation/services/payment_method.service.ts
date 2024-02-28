import { Op } from "sequelize";
import { PaymentMethod } from "../../database/mysql/models";
import { CustomError, PaymentMethodDto, PaymentMethodEntity, PaginationDto } from "../../domain";

export interface PaymentMethodFilters {
    name: string;
}
export class PaymentMethodService {

    public async getPaymentMethods() {
        const paymentMethods = await PaymentMethod.findAll();
        const paymentMethodsEntities = paymentMethods.map(paymentMethod => PaymentMethodEntity.fromObject(paymentMethod));
        return { items: paymentMethodsEntities };
    }

    public async getPaymentMethodsPaginated(paginationDto: PaginationDto, filters: PaymentMethodFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [paymentMethods, total] = await Promise.all([
            PaymentMethod.findAll({ where, offset: (page - 1) * limit, limit }),
            PaymentMethod.count({ where })
        ]);
        const paymentMethodsEntities = paymentMethods.map(paymentMethod => PaymentMethodEntity.fromObject(paymentMethod));
        return { items: paymentMethodsEntities, total_items: total };
    }

    public async getPaymentMethod(id: number) {
        const paymentMethod = await PaymentMethod.findByPk(id);
        if (!paymentMethod) throw CustomError.notFound('Método de pago no encontrado');
        const { ...paymentMethodEntity } = PaymentMethodEntity.fromObject(paymentMethod);
        return { paymentMethod: paymentMethodEntity };
    }

    public async createPaymentMethod(createPaymentMethodDto: PaymentMethodDto) {
        const paymentMethod = await PaymentMethod.findOne({ where: { name: createPaymentMethodDto.name } });
        if (paymentMethod) throw CustomError.badRequest('El método de pago ya existe');

        try {
            const paymentMethod = await PaymentMethod.create({
                name: createPaymentMethodDto.name
            });
            const { ...paymentMethodEntity } = PaymentMethodEntity.fromObject(paymentMethod);
            return { paymentMethod: paymentMethodEntity, message: 'Método de pago creado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El método de pago que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updatePaymentMethod(id: number, updatePaymentMethodDto: PaymentMethodDto) {
        const paymentMethod = await PaymentMethod.findByPk(id);
        if (!paymentMethod) throw CustomError.notFound('Método de pago no encontrado');

        try {
            await paymentMethod.update(updatePaymentMethodDto);
            const { ...paymentMethodEntity } = PaymentMethodEntity.fromObject(paymentMethod);
            return { paymentMethod: paymentMethodEntity, message: 'Método de pago actualizado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El método de pago que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deletePaymentMethod(id: number) {
        const paymentMethod = await PaymentMethod.findByPk(id);
        if (!paymentMethod) throw CustomError.notFound('Método de pago no encontrado');
        
        try {
            await paymentMethod.destroy();
            return { message: 'Método de pago eliminado correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}