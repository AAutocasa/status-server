import { Request, Router, Response } from "express";
import { CapabilityService } from "../services";
import { BaseError } from "../types";

export const CapabilitiesRouter = (router: Router, capabilitiesSvc: CapabilityService): void => {
    const prefix = `[CapabilitiesRouter]`;

    /** [GET] Get all devices! */
    router.get('/capabilities', async (req: Request, res: Response) => {
        console.log(`${prefix} [GET] '/capabilities' called...`);
        try {
            const capabilities = await capabilitiesSvc.GetCapabilities();

            res.status(200).send(capabilities);
        } catch (error) {
            const baseError = <BaseError>error;
            res.status(baseError.httpCode).send(baseError.formatted);
        }
    })
}
