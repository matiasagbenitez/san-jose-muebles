import { Request, Response } from "express";
import { CustomError, PaginationDto, CreateEntityAccountDTO } from "../../domain";
import { EntityAccountService } from '../services/entity_account.service';

export class EntityAccountController {

    protected service: EntityAccountService = new EntityAccountService();

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

        this.service.getEntitiesAccountsPaginated(paginationDto!, filters)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getDataById = async (req: Request, res: Response) => {
        const { id_entity, id_entity_account } = req.params;
        if (!id_entity_account || !id_entity) return res.status(400).json({ message: '¡Falta el ID de la entidad o de la cuenta!' });

        this.service.getAccountDataById(parseInt(id_entity), parseInt(id_entity_account))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getByEntity = async (req: Request, res: Response) => {
        const id_entity = parseInt(req.params.id_entity);
        if (!id_entity) return res.status(400).json({ message: 'Missing id_entity' });

        this.service.getEntityAccounts(id_entity)
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
        const [error, createDto] = CreateEntityAccountDTO.create(req.body);
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