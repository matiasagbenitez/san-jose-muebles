import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../domain";
import { DesignCommentService } from '../services/design_comment.service';
import { LoggedUserIdDto } from '../../domain/dtos/shared/logged-user-id.dto';
import { CreateDesignCommentDTO } from '../../domain/dtos/design/create-comment.dto';

export class DesignCommentController {

    protected service: DesignCommentService = new DesignCommentService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    getComments = async (req: Request, res: Response) => {
        const id_design = req.params.id_design;
        if (!id_design) return res.status(400).json({ message: '¡Falta el ID!' });

        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ message: error });
        if (!paginationDto) return res.status(400).json({ message: '¡Falta la paginación!' });

        this.service.getDesignCommentsPaginated(parseInt(id_design), paginationDto)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    createComment = async (req: Request, res: Response) => {

        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].toUpperCase().trim();
            }
        }

        const id_design = req.params.id_design;
        if (!id_design) return res.status(400).json({ message: '¡Falta el ID!' });

        const [error, loggedUserIdDto] = LoggedUserIdDto.create(req);
        if (error) return res.status(400).json({ message: error });
        if (!loggedUserIdDto) return res.status(400).json({ message: '¡Falta el usuario logueado!' });
        const id_user = loggedUserIdDto.id_user;

        const [errorDto, dto] = CreateDesignCommentDTO.create({ ...req.body, id_user });
        if (errorDto) return res.status(400).json({ message: errorDto });
        if (!dto) return res.status(400).json({ message: '¡Falta el comentario!' });

        this.service.createDesignComment(parseInt(id_design), dto)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

}