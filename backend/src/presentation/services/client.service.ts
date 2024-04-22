import { Op } from "sequelize";
import { Client } from "../../database/mysql/models";
import { CustomError, ClientCreateUpdateDto, ClientDetailEntity, ClientListEntity, PaginationDto } from "../../domain";

export interface ClientFilters {
    name: string;
    id_locality: number;
}

export class ClientService {

    public async getClients() {
        const clients = await Client.findAll();
        const clientsEntities = clients.map(client => ClientListEntity.fromObject(client));
        return { items: clientsEntities };
    }

    public async getClientsSelect() {
        const clients = await Client.findAll({
            order: ['name'], include: [{
                association: 'locality',
            }],
        });
        const clientsEntities = clients.map(client => ClientListEntity.fromObject(client));
        return { items: clientsEntities };
    }

    public async getClientsPaginated(paginationDto: PaginationDto, filters: ClientFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };
        if (filters.id_locality) where = { ...where, id_locality: filters.id_locality };

        const [clients, total] = await Promise.all([
            Client.findAll({
                where,
                include: [{
                    association: 'locality',
                }],
                offset: (page - 1) * limit,
                limit
            }),
            Client.count({ where })
        ]);
        const clientsEntities = clients.map(client => ClientListEntity.fromObject(client));
        return { items: clientsEntities, total_items: total };
    }

    public async getClient(id: number) {
        const client = await Client.findByPk(id, {
            include: [{
                association: 'locality',
            }]
        });
        if (!client) throw CustomError.notFound('Cliente no encontrado');
        const { ...clientEntity } = ClientDetailEntity.fromObject(client);
        return { client: clientEntity };
    }

    public async createClient(createDto: ClientCreateUpdateDto) {

        try {
            await Client.create({ ...createDto });
            return { message: 'Cliente creado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El cliente que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateClient(id: number, updateDto: ClientCreateUpdateDto) {
        const client = await Client.findByPk(id);
        if (!client) throw CustomError.notFound('Cliente no encontrado');
        try {
            await client.update({ ...updateDto });
            return { message: 'Cliente actualizado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El cliente que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteClient(id: number) {
        const client = await Client.findByPk(id);
        if (!client) throw CustomError.notFound('Cliente no encontrado');

        try {
            await client.destroy();
            return { message: 'Cliente eliminado correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}