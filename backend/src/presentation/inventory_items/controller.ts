import { Request, Response } from "express";
import {
    CustomError, PaginationDto,
    CreateInventoryItemDTO, UpdateInventoryItemDTO, LoggedUserIdDto
} from "../../domain";
import { InventoryItemService, InventoryItemFilters } from '../services/inventory_item.service';

export class InventoryItemController {

    protected service: InventoryItemService = new InventoryItemService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Métodos de la clase
    getAll = async (req: Request, res: Response) => {
        this.service.getInventoryItems()
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

        let filters: InventoryItemFilters = {};
        const { text, id_brand, id_category, status = 'OPERATIVO' } = req.query;
        if (text && typeof text === 'string') filters = { ...filters, text: text };
        if (id_brand && typeof id_brand === 'string') filters = { ...filters, id_inventory_brand: id_brand };
        if (id_category && typeof id_category === 'string') filters = { ...filters, id_inventory_categ: id_category };
        if (status && typeof status === 'string') filters = { ...filters, status: status.toUpperCase() as 'RESERVADO' | 'OPERATIVO' | 'RETIRADO' | 'DESCARTADO' | 'ALL' };

        this.service.getInventoryItemsPaginated(paginationDto!, filters)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getById = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'Falta el ID' });

        this.service.getInventoryItem(parseInt(id))
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
        const [error, createDto] = CreateInventoryItemDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });

        const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (id_error) return res.status(400).json({ message: id_error });

        this.service.createInventoryItem(createDto!, loggedUserIdDto?.id_user!)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    update = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id);
        if (!id) return res.status(400).json({ message: 'Falta el ID' });

        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            }
        }
        const [error, updateDto] = UpdateInventoryItemDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });

        this.service.updateInventoryItem(id, updateDto!)
            .then((data) => {
                res.status(200).json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    delete = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'Falta el ID' });

        this.service.deleteInventoryItem(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}