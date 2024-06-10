import { Request, Response } from "express";
import { CustomError, CreateEnvironmentDTO, PaginationDto } from "../../domain";
import { EnvironmentService, EnvironmentFilters } from '../services/environment.service';

export class EnvironmentController {

    protected service: EnvironmentService = new EnvironmentService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Métodos de la clase
    getByProject = async (req: Request, res: Response) => {
        const id_project = parseInt(req.params.id_project);
        if (!id_project) return res.status(400).json({ message: 'Missing id_project' });

        this.service.getEnvironmentsByProject(id_project)
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

        let filters = {};
        if (req.query.des_status) filters = { ...filters, des_status: req.query.des_status };
        if (req.query.fab_status) filters = { ...filters, fab_status: req.query.fab_status };
        if (req.query.ins_status) filters = { ...filters, ins_status: req.query.ins_status };
        if (req.query.id_client) filters = { ...filters, id_client: req.query.id_client };
        if (req.query.difficulty) filters = { ...filters, difficulty: req.query.difficulty };
        if (req.query.priority) filters = { ...filters, priority: req.query.priority };

        this.service.getAllPaginated(paginationDto!, filters as EnvironmentFilters)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getById = async (req: Request, res: Response) => {
        const { id_project, id_environment } = req.params;
        if (!id_project || !id_environment) return res.status(400).json({ message: '¡Faltan datos!' });

        this.service.getEnvironment(parseInt(id_project), parseInt(id_environment))
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
            }
        }
        const [error, createDto] = CreateEnvironmentDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });
        if (!createDto) return res.status(400).json({ message: 'Missing data' });

        this.service.createEnvironment(createDto)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    update = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (!id) return res.status(400).json({ message: 'Missing id' });

        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            }
        }
        const [error, updateDto] = CreateEnvironmentDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });
        if (!updateDto) return res.status(400).json({ message: 'Missing data' });

        this.service.updateEnvironment(id, updateDto)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    delete = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'Missing id' });

        this.service.deleteEnvironment(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}