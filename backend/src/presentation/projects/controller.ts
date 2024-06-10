import { Request, Response } from "express";
import { CustomError, CreateProjectDTO, PaginationDto, LoggedUserIdDto, CreateProjectEvolutionDTO } from "../../domain";
import { ProjectService, ProjectFilters } from '../services/project.service';

export class ProjectController {

    protected projectService: ProjectService = new ProjectService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Métodos de la clase
    getAll = async (req: Request, res: Response) => {
        this.projectService.getProjects()
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
        if (req.query.id_client) filters = { ...filters, id_client: req.query.id_client };
        if (req.query.id_locality) filters = { ...filters, id_locality: req.query.id_locality };
        if (req.query.status) filters = { ...filters, status: req.query.status };
        if (req.query.priority) filters = { ...filters, priority: req.query.priority };

        this.projectService.getProjectsPaginated(paginationDto!, filters as ProjectFilters)
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

        this.projectService.getProject(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getByIdBasic = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: '¡Falta el ID!' });

        this.projectService.getProjectBasic(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getByIdEditable = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: '¡Falta el ID!' });

        this.projectService.getProjectEditable(parseInt(id))
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
        const [error, createDto] = CreateProjectDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });

        this.projectService.createProject(createDto!)
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
        const [error, updateDto] = CreateProjectDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });

        this.projectService.updateProject(id, updateDto!)
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

        this.projectService.deleteProject(parseInt(id))
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

        const [errorDto, dto] = CreateProjectEvolutionDTO.create({ ...req.body, id_user });
        if (errorDto) return res.status(400).json({ message: errorDto });
        if (!dto) return res.status(400).json({ message: '¡Falta el DTO!' });

        this.projectService.updateStatus(parseInt(id), dto)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}