import { Op } from "sequelize";
import { Country, Province } from "../../database/mysql/models";
import { CustomError, CountryDto, CountryEntity, PaginationDto } from "../../domain";

export interface CountryFilters {
    name: string;
}
export class CountryService {

    public async getCountries(paginationDto: PaginationDto, filters: CountryFilters) {
        const { page, limit } = paginationDto;
        let where = {};
        // filter.name LIKE name
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [countries, total] = await Promise.all([
            Country.findAll({ where, offset: (page - 1) * limit, limit }),
            Country.count({ where })
        ]);
        const countriesEntities = countries.map(country => CountryEntity.fromObject(country));
        return { items: countriesEntities, total };
    }

    public async getCountry(id: number) {
        const country = await Country.findByPk(id);
        if (!country) throw CustomError.notFound('Country not found');
        const { ...countryEntity } = CountryEntity.fromObject(country);
        return { country: countryEntity };
    }

    public async createCountry(createCountryDto: CountryDto) {
        const country = await Country.findOne({ where: { name: createCountryDto.name } });
        if (country) throw CustomError.badRequest('Country already exists');

        try {
            const country = await Country.create({
                name: createCountryDto.name
            });
            const { ...countryEntity } = CountryEntity.fromObject(country);
            return { country: countryEntity };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateCountry(id: number, updateCountryDto: CountryDto) {
        const country = await Country.findByPk(id);
        if (!country) throw CustomError.notFound('Country not found');

        try {
            await country.update(updateCountryDto);
            const { ...countryEntity } = CountryEntity.fromObject(country);
            return { country: countryEntity };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteCountry(id: number) {
        const country = await Country.findByPk(id, { include: [{ model: Province, as: 'provinces' }] });
        if (!country) throw CustomError.notFound('Country not found');
        if (country.provinces) {
            if (country.provinces.length > 0) throw CustomError.badRequest('Country has provinces');
        }

        try {
            await country.destroy();
            return { message: 'Country deleted' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}