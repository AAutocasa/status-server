import { Request, Router, Response } from "express";
import { FirmwareService } from "../services";

export const FirmwareRouter = (router: Router, firmwareSvc: FirmwareService): void => {
    const prefix = `[FirmwareRouter]`;

    /** Hey! */
    router.get('/firmwares', async (req: Request, res: Response) => {
        console.log(`${prefix} [GET] '/firmwares' called...`);
        const firmwares = await firmwareSvc.GetFirmwares();
        res.status(200).send(firmwares);
    })
}