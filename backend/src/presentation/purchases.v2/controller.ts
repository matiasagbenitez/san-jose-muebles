import { Request, Response } from "express";
import { CustomError, PaginationDto, CreatePurchaseDTO, LoggedUserIdDto, UpdateItemStockDto } from "../../domain";
import { PurchaseV2Service, PurchaseFilters } from "../services/purchase.v2.service";

export class PurchaseV2Controller {

    protected purchaseService: PurchaseV2Service = new PurchaseV2Service();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
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

    getPurchasesBySupplierId = async (req: Request, res: Response) => {
        const id_supplier = req.params.id_supplier;
        if (!id_supplier) return res.status(400).json({ message: 'Missing id_supplier' });

        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ message: error });

        this.purchaseService.getPurchasesBySupplierId(paginationDto!, parseInt(id_supplier))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });

    }

    create = async (req: Request, res: Response) => {

        const [error, createDto] = CreatePurchaseDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });

        const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (id_error) return res.status(400).json({ message: id_error });

        // const { id_user } = req as any;
        // if (!id_user) return res.status(400).json({ message: 'Missing id_user' });

        if (createDto && loggedUserIdDto) {
            this.purchaseService.createPurchaseV2(createDto, loggedUserIdDto.id_user)
                .then((data) => {
                    res.json(data);
                })
                .catch((error) => {
                    this.handleError(error, res);
                });
        }
    }

    nullifyPurchase = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'Missing id' });

        const { reason } = req.body;
        if (!reason) return res.status(400).json({ message: 'Missing reason' });

        const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (id_error) return res.status(400).json({ message: id_error });

        if (loggedUserIdDto) {
            this.purchaseService.nullifyPurchaseV2(parseInt(id), reason, loggedUserIdDto.id_user)
                .then((data) => {
                    res.json(data);
                })
                .catch((error) => {
                    this.handleError(error, res);
                });
        }
    }

}