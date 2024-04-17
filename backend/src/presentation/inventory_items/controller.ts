import { Request, Response } from "express";
import { CreateInventoryItemDTO, CustomError, LoggedUserIdDto, NameDto, PaginationDto, RetireInventoryItemDTO, UpdateInventoryItemDTO } from "../../domain";
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

        let filters = {};
        const { text, id_brand, id_category, retired = 'false' } = req.query;
        if (text) filters = { ...filters, text: text };
        if (id_brand) filters = { ...filters, id_inventory_brand: id_brand };
        if (id_category) filters = { ...filters, id_inventory_categ: id_category };
        if (retired) filters = { ...filters, is_retired: retired };

        this.service.getInventoryItemsPaginated(paginationDto!, filters as InventoryItemFilters)
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
        if (!id) return res.status(400).json({ message: 'Missing id' });

        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            }
        }
        const [error, updateDto] = CreateInventoryItemDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });

        this.service.updateInventoryItem(id, updateDto!)
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

        this.service.deleteInventoryItem(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    // OPERACIONES
    validate = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'Missing id' });

        const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (id_error) return res.status(400).json({ message: id_error });

        this.service.validateInventoryItem(parseInt(id), loggedUserIdDto!.id_user)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    retire = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'Missing id' });

        const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (id_error) return res.status(400).json({ message: id_error });

        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            }
        }

        const { reason } = req.body;
        const [dtoError, retirementDto] = RetireInventoryItemDTO.create({ id_inventory_item: parseInt(id), retired_by: loggedUserIdDto!.id_user, reason });
        if (dtoError) return res.status(400).json({ message: dtoError });

        this.service.retireInventoryItem(retirementDto!)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    updateQuantity = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'Missing id' });

        const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (id_error) return res.status(400).json({ message: id_error });

        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            }
        }

        const { prev_quantity, new_quantity } = req.body;
        const [dtoError, retirementDto] = UpdateInventoryItemDTO.create({
            id_inventory_item: parseInt(id),
            prev_quantity: parseInt(prev_quantity),
            new_quantity: parseInt(new_quantity), 
            updated_by: loggedUserIdDto!.id_user,
        });
        if (dtoError) return res.status(400).json({ message: dtoError });

        this.service.updateQuantityInventoryItem(retirementDto!)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }



}