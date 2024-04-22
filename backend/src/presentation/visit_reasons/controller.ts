import { Request, Response } from "express";
import { CustomError, VisitReasonDTO, PaginationDto } from "../../domain";
import { VisitReasonService, VisitReasonFilters } from '../services/visit_reason.service';

export class VisitReasonController {

    protected visitReasonService: VisitReasonService = new VisitReasonService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Métodos de la clase
    getAll = async (req: Request, res: Response) => {
        this.visitReasonService.getVisitReasons()
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
        if (req.query.name) filters = { ...filters, name: req.query.name };

        this.visitReasonService.getVisitReasonsPaginated(paginationDto!, filters as VisitReasonFilters)
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

        this.visitReasonService.getVisitReason(parseInt(id))
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
        const [error, createDto] = VisitReasonDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });

        this.visitReasonService.createVisitReason(createDto!)
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
        const [error, updateDto] = VisitReasonDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });

        this.visitReasonService.updateVisitReason(id, updateDto!)
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

        this.visitReasonService.deleteVisitReason(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}