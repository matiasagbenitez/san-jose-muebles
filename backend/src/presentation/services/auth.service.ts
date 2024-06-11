import { Op } from "sequelize";
import { JwtAdapter, bcryptAdapter } from "../../config";
import { Role, RoleUser, User } from "../../database/mysql/models";
import { CustomError, LoginUserDto, RegisterUserDto, UpdatePasswordDto, UpdateUserDto, UserEntity, UserProfileEntity } from "../../domain";

export class AuthService {

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existingUser = await User.findOne({
            where: {
                [Op.or]: [
                    { email: registerUserDto.email },
                    { username: registerUserDto.username }
                ]
            }
        });
        if (existingUser) throw CustomError.badRequest('Email or username already exists');

        try {
            const hashedPassword = bcryptAdapter.hash(registerUserDto.password);

            const user = new User({
                name: registerUserDto.name,
                username: registerUserDto.username,
                email: registerUserDto.email,
                password: hashedPassword,
                phone: registerUserDto.phone,
            });

            await user.save();

            const { password, ...userEntity } = UserEntity.fromObject(user);
            return { user: userEntity };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const user = await User.findOne({
            where: { username: loginUserDto.username },
            include: [{
                model: Role,
                as: 'roles',
            }]
        });

        if (!user) throw CustomError.badRequest('Invalid credentials');

        const isPasswordMatch = bcryptAdapter.compare(loginUserDto.password, user.password);
        if (!isPasswordMatch) throw CustomError.badRequest('Invalid credentials');

        const { password, phone, ...userEntity } = UserEntity.fromObject(user);

        // Generate token JWT
        const token = await JwtAdapter.generateToken({ id_user: userEntity.id, name: userEntity.name, username: userEntity.username, roles: userEntity.roles });
        if (!token) throw CustomError.internalServerError('Error generating token');

        return { user: userEntity, token: token };
    }

    public async revalidateToken(req: any) {
        const { id_user, name, username, roles } = req;
        const token = await JwtAdapter.generateToken({ id_user, name, username, roles });
        if (!token) throw CustomError.internalServerError('Error generating token');
        return {
            user: { id: id_user, name, username, roles },
            token
        }
    }

    public async getUserProfile(id: number) {
        try {
            const user = await User.findByPk(id, {
                include: [{
                    model: Role,
                    as: 'roles',
                }]
            });
            if (!user) throw CustomError.notFound('User not found');
            const { ...userEntity } = UserProfileEntity.fromObject(user);

            return { user: userEntity };
        } catch (error) {
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updateProfile(id: number, dto: UpdateUserDto) {
        try {
            const user = await User.update({
                ...dto
            }, {
                where: { id }
            });
            if (!user) throw CustomError.notFound('User not found');

            const userUpdated = await User.findByPk(id, {
                include: [{
                    model: Role,
                    as: 'roles',
                }]
            });
            if (!userUpdated) throw CustomError.notFound('User not found');
            const { ...entity } = UserProfileEntity.fromObject(userUpdated);
            return { user: entity };

        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡El email, nombre o el nombre de usuario ya está asociado a otra cuenta!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

    public async updatePassword(id: number, id_user: number, dto: UpdatePasswordDto) {
        try {
            if (id !== id_user) throw CustomError.forbidden('¡No tienes permiso para realizar esta acción!');

            const user = await User.findByPk(id);
            if (!user) throw CustomError.notFound('User not found');

            const isPasswordMatch = bcryptAdapter.compare(dto.password, user.password);
            if (!isPasswordMatch) throw CustomError.badRequest('¡La contraseña actual no coincide!');

            const hashedPassword = bcryptAdapter.hash(dto.new_password);
            await User.update({
                password: hashedPassword
            }, {
                where: { id }
            });

            return { message: '¡Contraseña actualizada correctamente!' };

        } catch (error: any) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw CustomError.badRequest('¡El email, nombre o el nombre de usuario ya está asociado a otra cuenta!');
            }
            throw CustomError.internalServerError(`${error}`);
        }
    }

}