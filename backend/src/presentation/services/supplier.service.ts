import { Op } from "sequelize";
import { Supplier } from "../../database/mysql/models";
import { CustomError, SupplierDto, SupplierEntity, PaginationDto, SupplierSelectEntity } from "../../domain";

export interface SupplierFilters {
    name: string;
    id_locality: number;
}
export class SupplierService {

    public async getSuppliers() {
        const suppliers = await Supplier.findAll();
        const suppliersEntities = suppliers.map(supplier => SupplierEntity.fromObject(supplier));
        return { items: suppliersEntities };
    }

    public async getSuppliersSelect() {
        const suppliers = await Supplier.findAll({
            order: ['name'], include: [{
                association: 'locality',
                include: [{
                    association: 'province',
                }]
            }],
        });
        const suppliersEntities = suppliers.map(supplier => SupplierSelectEntity.fromObject(supplier));
        return { items: suppliersEntities };
    }

    public async getSuppliersPaginated(paginationDto: PaginationDto, filters: SupplierFilters) {
        const { page, limit } = paginationDto;

        // FILTERS
        let where = {};
        if (filters.name) where = { ...where, name: { [Op.like]: `%${filters.name}%` } };

        const [suppliers, total] = await Promise.all([
            Supplier.findAll({
                where,
                include: [{
                    association: 'locality',
                    include: [{
                        association: 'province',
                    }]
                }],
                offset: (page - 1) * limit,
                limit
            }),
            Supplier.count({ where })
        ]);
        const suppliersEntities = suppliers.map(supplier => SupplierEntity.listableSupplier(supplier));
        return { items: suppliersEntities, total_items: total };
    }

    public async getSupplier(id: number) {
        const supplier = await Supplier.findByPk(id, {
            include: [{
                association: 'locality',
                include: [{
                    association: 'province',
                }]
            }]
        });
        if (!supplier) throw CustomError.notFound('Proveedor no encontrado');
        const { ...supplierEntity } = SupplierEntity.fromObject(supplier);
        return { supplier: supplierEntity };
    }

    public async createSupplier(createSupplierDto: SupplierDto) {

        try {
            await Supplier.create({
                name: createSupplierDto.name,
                dni_cuit: createSupplierDto.dni_cuit,
                phone: createSupplierDto.phone,
                email: createSupplierDto.email,
                address: createSupplierDto.address,
                id_locality: createSupplierDto.id_locality,
                annotations: createSupplierDto.annotations
            });
            return { message: 'Proveedor creado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El proveedor que intenta crear ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateSupplier(id: number, updateSupplierDto: SupplierDto) {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) throw CustomError.notFound('Proveedor no encontrado');
        try {
            await supplier.update(updateSupplierDto);
            return { message: 'Proveedor actualizado correctamente' };
        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('El proveedor que intenta actualizar ya existe');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteSupplier(id: number) {
        const supplier = await Supplier.findByPk(id);
        if (!supplier) throw CustomError.notFound('Proveedor no encontrado');

        try {
            await supplier.destroy();
            return { message: 'Proveedor eliminado correctamente' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}