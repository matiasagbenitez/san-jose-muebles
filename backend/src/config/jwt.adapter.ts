import jwt from 'jsonwebtoken';
import { envs } from './envs';

export class JwtAdapter {
    constructor() { }

    static async generateToken(payload: any, duration: string = '2h') {
        return new Promise((resolve) => {
            jwt.sign(payload, envs.JWT_SECRET!, { expiresIn: duration }, (error, token) => {
                if (error) return resolve(null);
                resolve(token);
            });
        })
    }

    static validateToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, envs.JWT_SECRET!, (error, decoded) => {
                if (error) return resolve(null);
                resolve(decoded as T);
            });
        })
    }
}