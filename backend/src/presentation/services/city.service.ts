import { Province, City } from "../../database/mysql/models";
import { CityDto, CityEntity, CustomError } from "../../domain";

export class CityService {

    public async getCities() {
        const cities = await City.findAll({
            include: [{
                model: Province,
                as: 'province'
            }]
        });
        const citiesEntities = cities.map(city => CityEntity.fromObjectWithProvince(city));
        return { cities: citiesEntities };
    }

    public async getCity(id: number) {
        const city = await City.findByPk(id, {
            include: [{
                model: Province,
                as: 'province'
            }]
        });
        if (!city) throw CustomError.notFound('City not found');
        const { ...cityEntity } = CityEntity.fromObjectWithProvince(city);
        return { city: cityEntity };
    }

    public async createCity(createCityDto: CityDto) {
        const city = await City.findOne({ where: { name: createCityDto.name, id_province: createCityDto.id_province } });
        if (city) throw CustomError.badRequest('City already exists in the province');

        const province = await Province.findByPk(createCityDto.id_province);
        if (!province) throw CustomError.notFound('Province not found');

        try {
            const city = await City.create({
                name: createCityDto.name,
                id_province: createCityDto.id_province
            });
            const { ...cityEntity } = CityEntity.fromObject(city);
            return { city: cityEntity };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateCity(id: number, updateCityDto: CityDto) {
        const city = await City.findByPk(id);
        if (!city) throw CustomError.notFound('City not found');

        try {
            const province = await Province.findByPk(updateCityDto.id_province);
            if (!province) throw CustomError.notFound('Province not found');

            // Validate if the city already exists in the province
            const existing = await City.findOne({ where: { name: updateCityDto.name, id_province: updateCityDto.id_province } });
            if (existing && existing.id !== id) throw CustomError.badRequest('City already exists in the province');

            await city.update({
                name: updateCityDto.name,
                id_province: updateCityDto.id_province
            });
            const { ...cityEntity } = CityEntity.fromObject(city);
            return { city: cityEntity };
        } catch (error) { 
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteCity(id: number) {
        const city = await City.findByPk(id, {
            // TODO: clients, orders, etc
        });
        if (!city) throw CustomError.notFound('City not found');

        try {
            await city.destroy();
            return { message: 'City deleted' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}