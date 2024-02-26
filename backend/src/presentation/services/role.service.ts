import { Role } from "../../database/mysql/models";
import { CustomError, RoleDto, RoleEntity } from "../../domain";

export class RoleService {

    public async getRoles() {
        const roles = await Role.findAll();
        const rolesEntities = roles.map(role => RoleEntity.fromObject(role));
        return { roles: rolesEntities };
    }

    public async getRole(id: number) {
        const role = await Role.findByPk(id);
        if (!role) throw CustomError.notFound('Role not found');

        const { ...roleEntity } = RoleEntity.fromObject(role);
        return { role: roleEntity };
    }

    public async createRole(createRoleDto: RoleDto) {
        const existingRole = await Role.findOne({ where: { name: createRoleDto.name } });
        if (existingRole) throw CustomError.badRequest('Role already exists');

        try {

            const role = await Role.create({ name: createRoleDto.name });

            const { ...roleEntity } = RoleEntity.fromObject(role);
            return { role: roleEntity };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateRole(id: number, updateRoleDto: RoleDto) {
        const role = await Role.findByPk(id);
        if (!role) throw CustomError.notFound('Role not found');

        try {
            await role.update({ name: updateRoleDto.name });

            const { ...roleEntity } = RoleEntity.fromObject(role);
            return { role: roleEntity };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteRole(id: number) {
        const role = await Role.findByPk(id);
        if (!role) throw CustomError.notFound('Role not found');

        try {
            await role.destroy();
            return { message: 'Role deleted' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}