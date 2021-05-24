import { Request, Router, Response } from "express";
import { DeviceService } from "../services";
import { BaseError, DeviceInfo, DeviceRoleAssignment, HTTP400Error } from "../types";

export const DeviceRouter = (router: Router, deviceSvc: DeviceService): void => {
    const prefix = `[DeviceRouter]`;

    /** Hey! */
    router.get('/', (req: Request, res: Response) => {
        console.log(`${prefix} [GET] '/' called...`);
        res.status(200).send('Hey!');
    })

    /** [GET] Get all devices! */
    router.get('/devices', async (req: Request, res: Response) => {
        console.log(`${prefix} [GET] '/devices' called...`);
        try {
            const devices = await deviceSvc.GetAllDevices();
            
            res.status(200).send(devices);
        } catch (error) {
            const baseError = <BaseError>error;
            res.status(baseError.httpCode).send(baseError.formatted);
        }
    })

    /** [GET] Get a device with a specific ID */
    router.get('/devices/:deviceId', async (req: Request, res: Response) => {
        console.log(`${prefix} [GET] '/devices/:deviceId' called...`);
        try {
            const id = req.params["deviceId"];
            const device = await deviceSvc.GetDevice(id);
           
            res.status(200).send(device);
        } catch (error) {
            const baseError = <BaseError>error;
            res.status(baseError.httpCode).send(baseError.formatted);
        }
    })

    /** [PUT] Activate a device with a specific ID */
    router.put('/devices/:deviceId/activate', async (req: Request, res: Response) => {
        console.log(`${prefix} [PUT] '/devices/:deviceId/activate' called...`);
        try {
            const id = req.params["deviceId"];
            await deviceSvc.ActivateDevice(id);
            const device = await deviceSvc.GetDevice(id);
            
            res.status(200).send(device);
        } catch (error) {
            const baseError = <BaseError>error;
            res.status(baseError.httpCode).send(baseError.formatted);
        }
    })

    /** [PUT] Deactivate a device with a specific ID */
    router.put('/devices/:deviceId/deactivate', async (req: Request, res: Response) => {
        console.log(`${prefix} [PUT] '/devices/:deviceId/deactivate' called...`);
        try {
            const id = req.params["deviceId"];
            await deviceSvc.DeactivateDevice(id);
            const device = await deviceSvc.GetDevice(id);
            
            res.status(200).send(device);
        } catch (error) {
            const baseError = <BaseError>error;
            res.status(baseError.httpCode).send(baseError.formatted);
        }
    })

    /** [GET] Get all devices with type */
    router.get('/devices/:type', async (req: Request, res: Response) => {
        console.log(`${prefix} [GET] '/devices/:type' called...`);
        try {
            const type = req.params["type"];
            const device = await deviceSvc.GetDevicesByType(type);
            res.status(200).send(device);
        } catch (error) {
            const baseError = <BaseError>error;
            res.status(baseError.httpCode).send(baseError.formatted);
        }
    })

    /** [PUT] Sets a role to a device */
    router.put('/devices/:deviceId/role', async (req: Request, res: Response) => {
        console.log(`${prefix} [PUT] '/devices/:deviceId/role' called`);
        try {
            const id = req.params["deviceId"];
            const assignment = <DeviceRoleAssignment>req.body;

            if (!assignment.role) {
                throw new HTTP400Error(`No role information found`);
            }

            const result = await deviceSvc.SetDeviceRole(id, assignment.role);

            res.status(200).send(result);
        } catch (error) {
            const baseError = <BaseError>error;
            res.status(baseError.httpCode).send(baseError.formatted);
        }
    })

    /** [PUT] Sets naming infos to a device */
    router.put('/devices/:deviceId/infos', async (req: Request, res: Response) => {
        console.log(`${prefix} [PUT] '/devices/:deviceId/infos' called...`);
        try {
            const id = req.params["deviceId"];
            const info = <DeviceInfo>req.body;
            await deviceSvc.SetDeviceInfo(id, info);
            
            res.status(200).send();
        } catch (error) {
            const baseError = <BaseError>error;
            res.status(baseError.httpCode).send(baseError.formatted);
        }
    })

    /** [DELETE] Deletes a device */
    router.delete('/devices/:deviceId', async (req: Request, res: Response) => {
        console.log(`${prefix} [DELETE] '/devices/:deviceId/' called...`);
        try {
            const id = req.params["deviceId"];
            await deviceSvc.DeleteDevice(id);
            
            res.status(200).send();
        } catch (error) {
            const baseError = <BaseError>error;
            res.status(baseError.httpCode).send(baseError.formatted);
        }
    })
}
