import { Op } from "sequelize";
import { JwtAdapter, bcryptAdapter } from "../../config";
import { Role, RoleUser, User } from "../../database/mysql/models";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

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

}