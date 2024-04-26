import { Request, Response } from "express";
import { CustomError, PaginationDto, CreateProjectAccountDTO } from "../../domain";
import { ProjectAccountService } from '../services/project_account.service';

export class ProjectAccountController {

    protected service: ProjectAccountService = new ProjectAccountService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Métodos de la clase
    getAllPaginated = async (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ message: error });

        let filters = {};
        if (req.query.balance) filters = { ...filters, balance: req.query.balance };
        if (req.query.id_currency) filters = { ...filters, id_currency: req.query.id_currency };
        if (req.query.id_project) filters = { ...filters, id_project: req.query.id_project };

        this.service.getProjectsAccountsPaginated(paginationDto!, filters)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getDataById = async (req: Request, res: Response) => {
        const id_project_account = parseInt(req.params.id_project_account);
        if (!id_project_account) return res.status(400).json({ message: 'Missing id_project_account' });

        this.service.getAccountDataById(id_project_account)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getByProject = async (req: Request, res: Response) => {
        const id_project = parseInt(req.params.id_project);
        if (!id_project) return res.status(400).json({ message: 'Missing id_project' });

        this.service.getAccountsByProject(id_project)
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
                req.body[key] = req.body[key].trim();
            }
        }
        const [error, createDto] = CreateProjectAccountDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });

        this.service.createAccount(createDto!)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}