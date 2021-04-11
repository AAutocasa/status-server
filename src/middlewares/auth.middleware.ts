import express from 'express';

export const AuthMiddleware: any = function (validKeys: string[]) {
    return (req: express.Request, res: express.Response, next: any) => {
        const key = req.params["Authorization"] || '';
        key.replace('Bearer ', '');

        if (!(key in validKeys)) {
            res.status(401).send(`ERR: Invalid API key`);
            return;
        }

        next();
    }
}