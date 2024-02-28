import { Op } from "sequelize";
import { Country, Province } from "../../database/mysql/models";
import { CustomError, CountryDto, CountryEntity, PaginationDto } from "../../domain";

export interface CountryFilters {
    name: string;
}
export class CountryService {

    public async getCountries() {
        const countries = await Country.findAll();
        const countriesEntities = countries.map(country => CountryEntity.fromObject(country));
        return { items: countriesEntities };
    }

    public async getCountriesPaginated(paginationDto: PaginationDto, filters: CountryFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [countries, total] = await Promise.all([
            Country.findAll({ where, offset: (page - 1) * limit, limit }),
            Country.count({ where })
        ]);
        const countriesEntities = countries.map(country => CountryEntity.fromObject(country));
        return { items: countriesEntities, total_items: total };
    }

    public async getCountry(id: number) {
        const country = await Country.findByPk(id);
        if (!country) throw CustomError.notFound('País no encontrado');
        const { ...countryEntity } = CountryEntity.fromObject(country);
        return { country: countryEntity };
    }

    public async createCountry(createCountryDto: CountryDto) {
        const country = await Country.findOne({ where: { name: createCountryDto.name } });
        if (country) throw CustomError.badRequest('El país ya existe');

        try {
            const country = await Country.create({
                name: createCountryDto.name
            });
            const { ...countryEntity } = CountryEntity.fromObject(country);
            return { country: countryEntity, message: 'País creado correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateCountry(id: number, updateCountryDto: CountryDto) {
        const country = await Country.findByPk(id);
        if (!country) throw CustomError.notFound('País no encontrado');

        try {
            await country.update(updateCountryDto);
            const { ...countryEntity } = CountryEntity.fromObject(country);
            return { country: countryEntity, message: 'País actualizado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El país que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteCountry(id: number) {
        const country = await Country.findByPk(id, { include: [{ model: Province, as: 'provinces' }] });
        if (!country) throw CustomError.notFound('País no encontrado');
        if (country.provinces) {
            if (country.provinces.length > 0) throw CustomError.badRequest('No se puede eliminar el país, tiene provincias asociadas');
        }

        try {
            await country.destroy();
            return { message: 'País eliminado correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}