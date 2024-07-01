import { Request, Response } from "express";
import { CreateDesignEvolutionDTO, CustomError, LoggedUserIdDto, PaginationDto, UserDTO } from "../../domain";
import { DesignService, DesignFilters } from '../services/design.service';

export class DesignController {

    protected service: DesignService = new DesignService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    getAllPaginated = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ message: error });
        if (!paginationDto) return res.status(400).json({ message: '¡Falta el DTO!' });

        const [userError, userDto] = UserDTO.create(req);
        if (userError) return res.status(400).json({ message: userError });
        if (!userDto) return res.status(400).json({ message: '¡Falta el usuario!' });

        let filters: Partial<DesignFilters> = {};
        if (req.query.status) filters = { ...filters, status: req.query.status as DesignFilters['status'] };

        this.service.getDesignsPaginated(paginationDto, filters, userDto)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }


    getBasicById = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: '¡Falta el ID!' });

        this.service.getDesignBasic(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
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
        if (!id) return res.status(400).json({ message: '¡Falta el ID!' });

        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            }
        }

        const [error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (error) return res.status(400).json({ message: error });
        if (!loggedUserIdDto) return res.status(400).json({ message: '¡Falta el usuario logueado!' });
        const id_user = loggedUserIdDto.id_user;

        const [errorDto, dto] = CreateDesignEvolutionDTO.create({ ...req.body, id_user });
        if (errorDto) return res.status(400).json({ message: errorDto });
        if (!dto) return res.status(400).json({ message: '¡Falta el DTO!' });

        this.service.updateStatus(parseInt(id), dto)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getEvolutions = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: '¡Falta el ID!' });

        this.service.getEvolutions(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getTaskEvolutions = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: '¡Falta el ID!' });

        const id_task = req.params.id_task;
        if (!id_task) return res.status(400).json({ message: '¡Falta el ID!' });

        this.service.getTaskEvolutions(parseInt(id), parseInt(id_task))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }


}