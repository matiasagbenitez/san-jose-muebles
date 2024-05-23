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

    // Métodos de la clase
    create = async (req: Request, res: Response) => {

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