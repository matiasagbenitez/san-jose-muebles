import { Request, Response } from "express";
import { CustomError, PaginationDto, CreateEstimateDTO, LoggedUserIdDto } from "../../domain";
import { EstimateService, EstimateFilters } from '../services/estimate.service';

export class EstimateController {

    protected service: EstimateService = new EstimateService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Métodos de la clase
    getAll = async (req: Request, res: Response) => {
        this.service.getEstimates()
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getAllPaginated = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ message: error });

        let filters: EstimateFilters = {};
        if (req.query.text) filters.text = req.query.text as string;
        if (req.query.status) filters.status = req.query.status as string;

        this.service.getEstimatesPaginated(paginationDto!, filters)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getById = async (req: Request, res: Response) => {
        const { id, id_project } = req.params;
        if (!id || !id_project) return res.status(400).json({ message: '¡Falta el ID!' });

        this.service.getEstimate(parseInt(id), parseInt(id_project))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getByProject = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: '¡Falta el ID!' });

        this.service.getEstimatesByProject(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    create = async (req: Request, res: Response) => {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            } else if (Array.isArray(req.body[key])) {
                req.body[key].forEach((item: any) => {
                    for (let subKey in item) {
                        if (typeof item[subKey] === 'string') {
                            item[subKey] = item[subKey].toUpperCase().trim();
                        }
                    }
                });
            }
        }


        const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (id_error) return res.status(400).json({ message: id_error });
        const id_user = loggedUserIdDto!.id_user;

        const [error, dto] = CreateEstimateDTO.create({ ...req.body, id_user });
        if (error) return res.status(400).json({ message: error });

        this.service.createEstimate(dto!)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    delete = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: '¡Falta el ID!' });

        this.service.deleteEstimate(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}