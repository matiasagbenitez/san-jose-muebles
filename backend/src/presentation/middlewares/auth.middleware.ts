import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { User } from "../../database/mysql/models";

interface ExtendedRequest extends Request {
    id_user?: string;
    name?: string;
    username?: string;
    roles?: string[];
}

export class AuthMiddleware {
    static async validateJWT(req: Request, res: Response, next: NextFunction) {

        const token = req.header('x-token');
        if (!token) return res.status(401).json({ message: 'Token is required' });

        try {
            const payload = await JwtAdapter.validateToken<{ id_user: string, name: string, username: string, roles: string[] }>(token);
            if (!payload) return res.status(401).json({ message: 'Invalid token' });
            const { id_user, name, username, roles } = payload;
            
            const request = req as ExtendedRequest;
            request.id_user = id_user;
            request.name = name;
            request.username = username;
            request.roles = roles;

            next();

        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}