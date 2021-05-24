import express from 'express';
import { HTTP401Error } from '../types';

export const AuthMiddleware: any = function (validKeys: string[]) {
    return (req: express.Request, res: express.Response, next: any) => {
        const key = (req.get("Authorization") || '').replace('Bearer ', '');

        console.log(`[AuthMiddleware] Received request with key ${key}`);

        if (!validKeys.includes(key)) {
            console.log(`[AuthMiddleware] Blocking request...`);
            const unauthorizedError = new HTTP401Error(`Invalid API key`)
            res.status(unauthorizedError.httpCode).send(unauthorizedError.formatted);
            return;
        }

        next();
    }
}