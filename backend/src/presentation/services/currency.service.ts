import { Op } from "sequelize";
import { Currency } from "../../database/mysql/models";
import { CustomError, CurrencyDto, CurrencyEntity, PaginationDto } from "../../domain";

export interface CurrencyFilters {
    name: string;
    symbol: string;
}
export class CurrencyService {

    public async getCurrencies() {
        const currencies = await Currency.findAll();
        const currenciesEntities = currencies.map(currency => CurrencyEntity.fromObject(currency));
        return { items: currenciesEntities };
    }

    public async getCurrenciesMonetaries() {
        const currencies = await Currency.findAll({ where: { is_monetary: true } });
        const currenciesEntities = currencies.map(currency => CurrencyEntity.fromObject(currency));
        return { items: currenciesEntities };
    }

    public async getCurrenciesPaginated(paginationDto: PaginationDto, filters: CurrencyFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name || filters.symbol) {
            where = {
                [Op.or]: [
                    { name: { [Op.like]: `%${filters.name}%` } },
                    { symbol: { [Op.like]: `%${filters.name}%` } }
                ]
            };
        }

        const [currencies, total] = await Promise.all([
            Currency.findAll({ where, offset: (page - 1) * limit, limit }),
            Currency.count({ where })
        ]);
        const currenciesEntities = currencies.map(currency => CurrencyEntity.fromObject(currency));
        return { items: currenciesEntities, total_items: total };
    }

    public async getCurrency(id: number) {
        const currency = await Currency.findByPk(id);
        if (!currency) throw CustomError.notFound('Moneda no encontrada');
        const { ...currencyEntity } = CurrencyEntity.fromObject(currency);
        return { currency: currencyEntity };
    }

    public async createCurrency(createCurrencyDto: CurrencyDto) {
        const currency = await Currency.findOne({ where: { name: createCurrencyDto.name } });
        if (currency) throw CustomError.badRequest('La moneda ya existe');

        try {
            const currency = await Currency.create({
                name: createCurrencyDto.name,
                symbol: createCurrencyDto.symbol,
                is_monetary: createCurrencyDto.is_monetary
            });
            const { ...currencyEntity } = CurrencyEntity.fromObject(currency);
            return { currency: currencyEntity, message: 'Moneda creada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La moneda que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateCurrency(id: number, updateCurrencyDto: CurrencyDto) {
        const currency = await Currency.findByPk(id);
        if (!currency) throw CustomError.notFound('Moneda no encontrada');

        try {
            await currency.update(updateCurrencyDto);
            const { ...currencyEntity } = CurrencyEntity.fromObject(currency);
            return { currency: currencyEntity, message: 'Moneda actualizada correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('La moneda que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteCurrency(id: number) {
        const currency = await Currency.findByPk(id);
        if (!currency) throw CustomError.notFound('Moneda no encontrada');

        try {
            await currency.destroy();
            return { message: 'Moneda eliminada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}