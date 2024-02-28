import { Op } from "sequelize";
import { Province, City, Country } from "../../database/mysql/models";
import { CityDto, CityEntity, CustomError, PaginationDto } from "../../domain";

export interface CityFilters {
    name: string;
}
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

    public async getCitiesPaginated(paginationDto: PaginationDto, filters: CityFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [cities, total] = await Promise.all([
            City.findAll({
                where,
                include: [{
                    model: Province,
                    as: 'province'
                }],
                offset: (page - 1) * limit,
            }),
            City.count({ where })
        ]);
        const citiesEntities = cities.map(city => CityEntity.fromObjectWithProvince(city));
        return { items: citiesEntities, total_items: total };
    }

    public async getCity(id: number) {
        const city = await City.findByPk(id, {
            include: [{
                model: Province,
                as: 'province'
            }]
        });
        if (!city) throw CustomError.notFound('Ciudad no encontrada');
        const { ...cityEntity } = CityEntity.fromObjectWithProvince(city);
        return { city: cityEntity };
    }

    public async createCity(createCityDto: CityDto) {
        const province = await Province.findByPk(createCityDto.id_province);
        if (!province) throw CustomError.notFound('Provincia no encontrada');

        const city = await City.findOne({ where: { name: createCityDto.name, id_province: createCityDto.id_province } });
        if (city) throw CustomError.badRequest('La ciudad ya existe en la provincia');

        try {
            const city = await City.create({
                name: createCityDto.name,
                id_province: createCityDto.id_province
            });
            const { ...cityEntity } = CityEntity.fromObject(city);
            return { city: cityEntity, message: 'Ciudad creada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateCity(id: number, updateCityDto: CityDto) {
        const city = await City.findByPk(id);
        if (!city) throw CustomError.notFound('Ciudad no encontrada');

        try {
            const province = await Province.findByPk(updateCityDto.id_province);
            if (!province) throw CustomError.notFound('Provincia no encontrada');

            // Validate if the city already exists in the province
            const existing = await City.findOne({ where: { name: updateCityDto.name, id_province: updateCityDto.id_province } });
            if (existing && existing.id !== id) throw CustomError.badRequest('La ciudad ya existe en la provincia');

            await city.update({
                name: updateCityDto.name,
                id_province: updateCityDto.id_province
            });
            const { ...cityEntity } = CityEntity.fromObject(city);
            return { city: cityEntity, message: 'Ciudad actualizada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteCity(id: number) {
        const city = await City.findByPk(id, {
            // TODO: clients, orders, etc
        });
        if (!city) throw CustomError.notFound('Ciudad no encontrada');

        try {
            await city.destroy();
            return { message: 'Ciudad eliminada correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}