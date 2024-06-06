import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../domain";
import { DesignTaskService } from '../services/design_task.service';
import { LoggedUserIdDto, CreateDesignTaskDTO } from '../../domain';

export class DesignTaskController {

    protected service: DesignTaskService = new DesignTaskService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    createTask = async (req: Request, res: Response) => {

        const id_design = req.params.id_design;
        if (!id_design) return res.status(400).json({ message: '¡Falta el ID!' });

        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            }
        }

        const [error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (error) return res.status(400).json({ message: error });
        if (!loggedUserIdDto) return res.status(400).json({ message: '¡Falta el usuario logueado!' });
        const id_user = loggedUserIdDto.id_user;

        const [errorDto, dto] = CreateDesignTaskDTO.create({ ...req.body, id_user });
        if (errorDto) return res.status(400).json({ message: errorDto });
        if (!dto) return res.status(400).json({ message: '¡Faltan datos!' });

        this.service.createTask(parseInt(id_design), dto)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    updateStatus = async (req: Request, res: Response) => {

        const id_task = req.params.id_task;
        if (!id_task) return res.status(400).json({ message: '¡Falta el ID!' });

        const status = req.body.status;
        if (!status) return res.status(400).json({ message: '¡Falta el estado!' });

        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            }
        }

        const [error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (error) return res.status(400).json({ message: error });
        if (!loggedUserIdDto) return res.status(400).json({ message: '¡Falta el usuario logueado!' });
        const id_user = loggedUserIdDto.id_user;


        this.service.updateTaskStatus(parseInt(id_task), status, id_user)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    deleteTask = async (req: Request, res: Response) => {
        const id_design = req.params.id_design;
        const id_task = req.params.id_task;
        if (!id_design || !id_task) return res.status(400).json({ message: '¡Falta el ID!' });

        const [error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (error) return res.status(400).json({ message: error });
        if (!loggedUserIdDto) return res.status(400).json({ message: '¡Falta el usuario logueado!' });
        const id_user = loggedUserIdDto.id_user;

        this.service.deleteDesignTask(parseInt(id_design), parseInt(id_task), id_user)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}