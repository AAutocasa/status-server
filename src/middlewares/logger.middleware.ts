import express from 'express';

export const LoggerMiddleware: any = function() {
    return (req: express.Request, res: express.Response, next: any) => {
        console.log(`[Logger] [${req.method}] URL ${req.originalUrl} called!`)
        next();
    }
}