import { Request, Response } from "express";
import { CustomError, LoggedUserIdDto, CreateProjectAccountTransactionDTO, PaginationDto } from "../../domain";
import { ProjectAccountTransactionService } from '../services/project_account_transaction.service';

export class ProjectAccountTransactionController {

    protected service: ProjectAccountTransactionService = new ProjectAccountTransactionService();

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

        const id_project_account = parseInt(req.params.id_project_account);
        if (!id_project_account) return res.status(400).json({ message: 'Missing id_project_account xs' });

        this.service.getTransactionsByAccountPaginated(paginationDto!, id_project_account)
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
            const [error, createDto] = CreateProjectAccountTransactionDTO.create(req.body);
            if (error) return res.status(400).json({ message: error });

            const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
            if (id_error) return res.status(400).json({ message: id_error });

            if (createDto && loggedUserIdDto) {
                switch (createDto.type) {
                    case 'NEW_PAYMENT':
                        this.service.createTransactionNewPayment(createDto, loggedUserIdDto.id_user)
                            .then((data) => { res.json(data); })
                            .catch((error) => { this.handleError(error, res); });
                        break;

                    case 'POS_ADJ':
                        this.service.createTransactionPosAdj(createDto, loggedUserIdDto.id_user)
                            .then((data) => { res.json(data); })
                            .catch((error) => { this.handleError(error, res); });
                        break;

                    case 'NEG_ADJ':
                        this.service.createTransactionNegAdj(createDto, loggedUserIdDto.id_user)
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