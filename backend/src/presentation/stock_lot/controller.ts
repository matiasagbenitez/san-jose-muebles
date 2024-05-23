import { Request, Response } from "express";
import { CreateStockLotDTO, CustomError, LoggedUserIdDto, PaginationDto } from "../../domain";
import { StockLotService } from "../services/stock_lot.service";
export class StockLotController {

    protected service: StockLotService = new StockLotService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    getLotsPaginated = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);

        if (error) return res.status(400).json({ message: error });
        if (!paginationDto) return res.status(500).json({ message: '¡No se pudo obtener la información de paginación!' });

        let filters = {};
        if (req.query.description) filters = { ...filters, description: req.query.description };
        if (req.query.type) filters = { ...filters, type: req.query.type };

        this.service.getStockLots(paginationDto, filters)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getLotBasic = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: '¡No se recibió el identificador del lote!' });

        this.service.getLotBasic(+id)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    getLotPaginated = async (req: Request, res: Response) => {
        const { id: id_stock_lot } = req.params;
        if (!id_stock_lot) return res.status(400).json({ message: '¡No se recibió el identificador del lote!' });

        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);

        if (error) return res.status(400).json({ message: error });
        if (!paginationDto) return res.status(500).json({ message: '¡No se pudo obtener la información de paginación!' });

        this.service.getStockLot(+id_stock_lot, paginationDto)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    // Métodos de la clase
    create = async (req: Request, res: Response) => {

        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            }
        }

        const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (id_error) return res.status(400).json({ message: id_error });
        const id_user = loggedUserIdDto!.id_user;

        const [error, dto] = CreateStockLotDTO.create({ ...req.body, id_user });
        if (error) return res.status(400).json({ message: error });
        if (!dto) return res.status(500).json({ message: '¡No se pudo obtener la información del lote!' });

        this.service.createStockLot(dto)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}