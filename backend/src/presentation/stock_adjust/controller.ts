import { Request, Response } from "express";
import { CustomError, StockAdjustDto } from "../../domain";
import { StockAdjustService } from "../services/stock_adjust.service";

export class StockAdjustController {

    protected service: StockAdjustService = new StockAdjustService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Métodos de la clase
    getAllByIdProduct = async (req: Request, res: Response) => {
        const id_product = req.params.id_product;
        if (!id_product) return res.status(400).json({ message: 'Missing id_product' });

        this.service.getStockAdjustsByProductId(parseInt(id_product))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}