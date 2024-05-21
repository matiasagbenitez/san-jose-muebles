import { Request, Response } from "express";
import { CustomError, LoggedUserIdDto, CreateEntityTransactionDTO, PaginationDto } from "../../domain";
import { EntityAccountTransactionService } from '../services/entity_account_transaction.service';

export class EntityAccountTransactionController {

    protected service: EntityAccountTransactionService = new EntityAccountTransactionService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Métodos de la clase
    getTransactionsByAccountPaginated = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ message: error });

        const id_supplier_account = parseInt(req.params.id_supplier_account);
        if (!id_supplier_account) return res.status(400).json({ message: 'Missing id_supplier_account' });

        this.service.getTransactionsByAccountPaginated(paginationDto!, id_supplier_account)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getTransaction = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: '¡Falta el ID!' });

        this.service.getTransactionById(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    addNewMovement = async (req: Request, res: Response) => {
        try {
            for (let key in req.body) {
                if (typeof req.body[key] === 'string') {
                    req.body[key] = req.body[key].toUpperCase().trim();
                }
            }

            const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
            if (id_error) return res.status(400).json({ message: id_error });

            const [error, createDto] = CreateEntityTransactionDTO.create({ ...req.body, id_user: loggedUserIdDto?.id_user });
            if (error) return res.status(400).json({ message: error });

            if (createDto && loggedUserIdDto) {
                switch (createDto.type) {
                    case 'PAYMENT':
                        this.service.createTransactionNewPayment(createDto)
                            .then((data) => { res.json(data); })
                            .catch((error) => { this.handleError(error, res); });
                        break;

                    case 'DEBT':
                        this.service.createTransactionNewDebt(createDto)
                            .then((data) => { res.json(data); })
                            .catch((error) => { this.handleError(error, res); });
                        break;

                    case 'POS_ADJ':
                        this.service.createTransactionPosAdj(createDto)
                            .then((data) => { res.json(data); })
                            .catch((error) => { this.handleError(error, res); });
                        break;

                    case 'NEG_ADJ':
                        this.service.createTransactionNegAdj(createDto)
                            .then((data) => { res.json(data); })
                            .catch((error) => { this.handleError(error, res); });
                        break;
                    default:
                        break;
                }
            }
        } catch (error: unknown) {
            this.handleError(error, res);
        }
    }

}