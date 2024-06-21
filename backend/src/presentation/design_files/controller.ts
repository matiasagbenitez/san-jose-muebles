import { Request, Response } from "express";
import { CustomError, LoggedUserIdDto } from "../../domain";
import { DesignFileService } from "../services/design_file.service";

export class DesignFileController {

    protected service: DesignFileService = new DesignFileService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    uploadDesignFiles = async (req: Request, res: Response) => {

        const { id } = req.params;
        if (!id) return res.status(400).json({ message: '¡Falta el ID!' });

        const files = req.files as Express.Multer.File[];
        if (!files) return res.status(400).json({ message: '¡Petición inválida!' });

        const [error, dto] = LoggedUserIdDto.create(req);
        if (error) return res.status(400).json({ message: error });
        if (!dto) return res.status(400).json({ message: '¡Falta el usuario logueado!' });
        const id_user = dto.id_user;

        this.service.uploadDesignFiles(Number(id), files, id_user)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getDesignFiles = async (req: Request, res: Response) => {

        const { id } = req.params;
        if (!id) return res.status(400).json({ message: '¡Falta el ID!' });

        this.service.getDesignFiles(Number(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    deleteDesignFile = async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        if (!id) return res.status(400).json({ message: '¡Petición inválida!' });

        this.service.deleteFile(id)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}