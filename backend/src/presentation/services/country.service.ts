import { Country, Province } from "../../database/mysql/models";
import { CustomError, CountryDto, CountryEntity } from "../../domain";

export class CountryService {

    public async getCountries() {
        const countries = await Country.findAll();
        const countriesEntities = countries.map(country => CountryEntity.fromObject(country));
        return { countries: countriesEntities };
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