import { Request, Response } from "express";
import { CustomError, ManageMemberDTO } from "../../domain";
import { GroupMemberService } from '../services/group_member.service';

export class GroupMemberController {

    protected service: GroupMemberService = new GroupMemberService();

    private handleError(error: unknown, res: Response) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }

    add = async (req: Request, res: Response) => {

        const [error, dto] = ManageMemberDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });

        this.service.addMemberToGroup(dto!)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }

    remove = async (req: Request, res: Response) => {

        const [error, dto] = ManageMemberDTO.create(req.body);
        if (error) return res.status(400).json({ message: error });

        this.service.removeMemberFromGroup(dto!)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                this.handleError(error, res);
            });
    }
}