import { Request, Router, Response } from "express";
import { DeviceService } from "../services";

export const DeviceRouter = (router: Router, deviceSvc: DeviceService): void => {
    const prefix = `[DeviceRouter]`;

    router.get('/', (req: Request, res: Response) => {
        console.log(`${prefix} '/' called...`);
        res.status(200).send('Hey!');
    })

    router.get('/devices', async (req: Request, res: Response) => {
        console.log(`${prefix} '/devices' called...`);
        try {
            const devices = await deviceSvc.GetAllDevices();
            res.status(200).send(devices);
        } catch (error) {
            res.status(500).send({err: error});
        }
    })

    router.get('/devices/:deviceId', async (req: Request, res: Response) => {
        console.log(`${prefix} '/devices/:deviceId' called...`);
        try {
            const id = req.params["deviceId"];
            const device = await deviceSvc.GetDevice(id);
            res.status(200).send(device);
        } catch (error) {
            res.status(500).send({err: error});
        }
    })

    router.get('/devices/:deviceId/activate', async (req: Request, res: Response) => {
        console.log(`${prefix} '/devices/:deviceId/activate' called...`);
        try {
            const id = req.params["deviceId"];
            await deviceSvc.ActivateDevice(id);
            res.status(200).send();
        } catch (error) {
            res.status(500).send({err: error});
        }
    })

    router.get('/devices/:deviceId/deactivate', async (req: Request, res: Response) => {
        console.log(`${prefix} '/devices/:deviceId/deactivate' called...`);
        try {
            const id = req.params["deviceId"];
            await deviceSvc.DeactivateDevice(id);
            res.status(200).send();
        } catch (error) {
            res.status(500).send({err: error});
        }
    })

    router.get('/devices/:type', async (req: Request, res: Response) => {
        console.log(`${prefix} '/devices/:type' called...`);
        try {
            const type = req.params["type"];
            const device = await deviceSvc.GetDevicesByType(type);
            res.status(200).send(device);
        } catch (error) {
            res.status(500).send({err: error});
        }
    })
}