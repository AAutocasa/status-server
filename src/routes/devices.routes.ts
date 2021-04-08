import { Request, Router, Response } from "express";
import { DeviceService } from "../services";
import { RoleAssignment } from "../types";

export const DeviceRouter = (router: Router, deviceSvc: DeviceService): void => {
    const prefix = `[DeviceRouter]`;

    /** Hey! */
    router.get('/', (req: Request, res: Response) => {
        console.log(`${prefix} '/' called...`);
        res.status(200).send('Hey!');
    })

    /** [GET] Get all devices! */
    router.get('/devices', async (req: Request, res: Response) => {
        console.log(`${prefix} '/devices' called...`);
        try {
            const devices = await deviceSvc.GetAllDevices();
            res.status(200).send(devices);
        } catch (error) {
            res.status(500).send({err: error});
        }
    })

    /** [GET] Get a device with a specific ID */
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

    /** [GET] Activate a device with a specific ID */
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

    /** [GET] Deactivate a device with a specific ID */
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

    /** [GET] Get all devices with type */
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

    /** [POST] Sets a role to a device */
    router.post('/devices/set-role', async (req: Request, res: Response) => {
        console.log(`${prefix} '/devices/set-role' called...`);
        try {
            const assignment = <RoleAssignment>req.body;
            if (!assignment.role) {
                res.status(400).send(`ERR: No role information found`);
                return;
            }

            // TODO: Figure out why the fuck the type of role is string
            const result = await deviceSvc.SetDeviceRole(assignment.id, assignment.role);
            res.status(200).send(result);
        } catch (error) {
            res.status(500).send({err: error});
        }
    })
}