import { Request, Response } from "express";
import { CustomError, VisitRequestDTO, PaginationDto, LoggedUserIdDto } from "../../domain";
import { VisitRequestService, VisitRequestFilters } from '../services/visit_request.service';

export class VisitRequestController {

    protected service: VisitRequestService = new VisitRequestService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    // Métodos de la clase
    getAll = async (req: Request, res: Response) => {
        this.service.getVisitRequests()
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
        if (req.query.id_client) filters = { ...filters, id_client: req.query.id_client };
        if (req.query.id_locality) filters = { ...filters, id_locality: req.query.id_locality };
        if (req.query.id_visit_reason) filters = { ...filters, id_visit_reason: req.query.id_visit_reason };
        if (req.query.priority) filters = { ...filters, priority: req.query.priority };
        if (req.query.status) filters = { ...filters, status: req.query.status };
        if (req.query.start) filters = { ...filters, start: req.query.start };
        if (req.query.end) filters = { ...filters, end: req.query.end };
        if (req.query.order_criteria) filters = { ...filters, order_criteria: req.query.order_criteria };

        this.service.getVisitRequestsPaginated(paginationDto!, filters as VisitRequestFilters)
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

        this.service.getVisitRequest(parseInt(id))
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

        const [id_error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (id_error) return res.status(400).json({ message: id_error });

        const [error, createDto] = VisitRequestDTO.create({ ...req.body, id_user: loggedUserIdDto!.id_user });
        if (error) return res.status(400).json({ message: error });

        this.service.createVisitRequest(createDto!)
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
        const [error, updateDto] = VisitRequestDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });

        this.service.updateVisitRequest(id, updateDto!)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    delete = async (req: Request, res: Response) => {
        const id = req.params.id;
        if (!id) return res.status(400).json({ message: 'Falta el ID' });

        this.service.deleteVisitRequest(parseInt(id))
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}