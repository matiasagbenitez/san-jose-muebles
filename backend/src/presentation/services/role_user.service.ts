import { Role, User, RoleUser } from "../../database/mysql/models";
import { CustomError, RoleUserDto, RoleUserEntity } from "../../domain";

export class RoleUserService {

    public async getRolesUsers() {
        const roles_users = await RoleUser.findAll();
        const rolesUsersEntities = roles_users.map(role => RoleUserEntity.fromObject(role));
        return { roles_users: rolesUsersEntities };
    }

    public async getRoleUser(id: number) {
        const roleUser = await RoleUser.findByPk(id);
        if (!roleUser) throw CustomError.notFound('Role_user not found');

        const { ...roleUserEntity } = RoleUserEntity.fromObject(roleUser);
        return { role_user: roleUserEntity };
    }

    public async createRoleUser(createRoleUserDto: RoleUserDto) {
        const existingRoleUser = await RoleUser.findOne({ where: { id_role: createRoleUserDto.id_role, id_user: createRoleUserDto.id_user } });
        if (existingRoleUser) throw CustomError.badRequest('Role_user already exists');

        try {

            const role = await Role.findByPk(createRoleUserDto.id_role);
            if (!role) throw CustomError.notFound('Role not found');

            const user = await User.findByPk(createRoleUserDto.id_user);
            if (!user) throw CustomError.notFound('User not found');

            const roleUser = await RoleUser.create({
                id_role: createRoleUserDto.id_role,
                id_user: createRoleUserDto.id_user,
            });

            const { ...roleUserEntity } = RoleUserEntity.fromObject(roleUser);
            return { role_user: roleUserEntity };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async deleteRoleUser(id: number) {
        const roleUser = await RoleUser.findByPk(id);
        if (!roleUser) throw CustomError.notFound('Role_user not found');

        try {
            await roleUser.destroy();
            return { message: 'Role_user deleted' };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

}