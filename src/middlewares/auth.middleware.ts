import express from 'express';

export const AuthMiddleware: any = function (validKeys: string[]) {
    return (req: express.Request, res: express.Response, next: any) => {
        const key = (req.get("Authorization") || '').replace('Bearer ', '');

        console.log(`[AuthMiddleware] Received request with key ${key}`);

        if (!validKeys.includes(key)) {
            res.status(401).send(`ERR: Invalid API key`);
            return;
        }

        next();
    }
}