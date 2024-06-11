import { Request, Response } from "express";
import { CustomError, LoggedUserIdDto, LoginUserDto, RegisterUserDto, UpdatePasswordDto, UpdateUserDto, UserDTO } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {

    protected authService: AuthService = new AuthService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Métodos de la clase
    register = async (req: Request, res: Response) => {
        const [error, registerDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ message: error });

        this.authService.registerUser(registerDto!)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    login = async (req: Request, res: Response) => {
        const [error, loginDto] = LoginUserDto.create(req.body);
        if (error) return res.status(400).json({ message: error });

        this.authService.loginUser(loginDto!)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    revalidateToken = async (req: Request, res: Response) => {
        this.authService.revalidateToken(req)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getUserProfile = async (req: Request, res: Response) => {

        const [error, userDto] = UserDTO.create(req);
        if (error) return res.status(400).json({ message: error });
        if (!userDto) return res.status(400).json({ message: '¡Falta el usuario!' });

        this.authService.getUserProfile(userDto.id)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    updateProfile = async (req: Request, res: Response) => {

        const { id } = req.params;
        if (!id) return res.status(400).json({ message: '¡Falta el id del usuario!' });

        const [error, userDto] = UpdateUserDto.create(req.body);
        if (error) return res.status(400).json({ message: error });
        if (!userDto) return res.status(400).json({ message: '¡Falta el usuario!' });

        this.authService.updateProfile(parseInt(id), userDto)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    updatePassword = async (req: Request, res: Response) => {

        const { id } = req.params;
        if (!id) return res.status(400).json({ message: '¡Falta el id del usuario!' });

        const [error, dto] = UpdatePasswordDto.create(req.body);
        if (error) return res.status(400).json({ message: error });
        if (!dto) return res.status(400).json({ message: '¡Falta el usuario!' });

        const [idError, idDto] = LoggedUserIdDto.create(req);
        if (idError) return res.status(400).json({ message: idError });
        if (!idDto) return res.status(400).json({ message: '¡Falta el usuario!' });

        this.authService.updatePassword(parseInt(id), idDto.id_user, dto)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}