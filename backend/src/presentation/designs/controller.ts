import { Request, Response } from "express";
import { CustomError, LoggedUserIdDto, PaginationDto } from "../../domain";
import { DesignService } from '../services/design.service';

export class DesignController {

    protected service: DesignService = new DesignService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    getById = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: '¡Falta el ID!' });

        this.service.getDesign(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    updateStatus = async (req: Request, res: Response) => {
        const id = req.params.id;
        const status = req.body.status;
        if (!id || !status) return res.status(400).json({ message: '¡Faltan datos!' });

        const [error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (error) return res.status(400).json({ message: error });
        if (!loggedUserIdDto) return res.status(400).json({ message: '¡Falta el usuario logueado!' });
        const id_user = loggedUserIdDto.id_user;

        this.service.updateStatus(parseInt(id), status, id_user)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}