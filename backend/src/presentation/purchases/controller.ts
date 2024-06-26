import { Request, Response } from "express";
import { CustomError, PaginationDto, CreatePurchaseDTO, LoggedUserIdDto, UpdateItemStockDto } from "../../domain";
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
        const { id_supplier, from_date, to_date, stock, status } = req.query;
        if (id_supplier) filters = { ...filters, id_supplier };
        if (from_date) filters = { ...filters, from_date };
        if (to_date) filters = { ...filters, to_date };
        if (stock) filters = { ...filters, stock };
        if (status) filters = { ...filters, status };

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
            this.purchaseService.createPurchase(createDto, loggedUserIdDto.id_user)
                .then((data) => {
                    res.json(data);
                })
                .catch((error) => {
                    this.handleError(error, res);
                });
        }
    }

    updateReceivedStock = async (req: Request, res: Response) => {
        const { id_purchase, id_item } = req.params;
        if (!id_purchase || !id_item) return res.status(400).json({ message: 'Missing id_purchase or id_item' });

        const { quantity_received } = req.body;
        if (!quantity_received || isNaN(quantity_received)) return res.status(400).json({ message: 'Missing quantity_received' });

        const [error, updateItemDto] = UpdateItemStockDto.create({ id_purchase, id_item, quantity_received });
        if (error) return res.status(400).json({ message: error });

        const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (id_error) return res.status(400).json({ message: id_error });

        if (updateItemDto && loggedUserIdDto) {
            this.purchaseService.updateReceivedStock(updateItemDto, loggedUserIdDto.id_user)
                .then((data) => {
                    res.json(data);
                })
                .catch((error) => {
                    this.handleError(error, res);
                });
        }
    }

    updatePurchaseFullStock = async (req: Request, res: Response) => {
        const id_purchase = req.params.id_purchase;
        if (!id_purchase) return res.status(400).json({ message: 'Missing id_purchase' });

        const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (id_error) return res.status(400).json({ message: id_error });

        if (loggedUserIdDto && id_purchase) {
            this.purchaseService.setPurchaseFullyStocked(parseInt(id_purchase), loggedUserIdDto.id_user)
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
            this.purchaseService.nullifyPurchase(parseInt(id), reason, loggedUserIdDto.id_user)
                .then((data) => {
                    res.json(data);
                })
                .catch((error) => {
                    this.handleError(error, res);
                });
        }
    }

    getReceptions = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'Missing id' });

        this.purchaseService.getPurchaseReceptions(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}