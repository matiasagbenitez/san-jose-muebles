import { Request, Response } from "express";
import { CustomError, PaginationDto, NewPurchaseDto, LoggedUserIdDto } from "../../domain";
import { PurchaseService, PurchaseFilters } from "../services/purchase.service";

export class PurchaseController {

    protected purchaseService: PurchaseService = new PurchaseService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Métodos de la clase
    getAll = async (req: Request, res: Response) => {

        this.purchaseService.getPurchases()
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
        // if (req.query.name) filters = { ...filters, name: req.query.name };

        this.purchaseService.getPurchasesPaginated(paginationDto!, filters as PurchaseFilters)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getById = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'Missing id' });

        this.purchaseService.getPurchase(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    create = async (req: Request, res: Response) => {

        const [error, createDto] = NewPurchaseDto.create(req.body);
        if (error) return res.status(400).json({ message: error });

        const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (id_error) return res.status(400).json({ message: id_error });

        // const { id_user } = req as any;
        // if (!id_user) return res.status(400).json({ message: 'Missing id_user' });

        if (createDto && loggedUserIdDto) {
            this.purchaseService.createPurchase(createDto, loggedUserIdDto.id_user)
                .then((data) => {
                    res.json(data);
                })
                .catch((error) => {
                    this.handleError(error, res);
                });
        }
    }



    // delete = async (req: Request, res: Response) => {
    //     const id = req.params.id;
    //     if (!id) return res.status(400).json({ message: 'Missing id' });

    //     this.purchaseService.deletePurchase(parseInt(id))
    //         .then((data) => {
    //             res.json(data);
    //         })
    //         .catch((error) => {
    //             this.handleError(error, res);
    //         });
    // }

}