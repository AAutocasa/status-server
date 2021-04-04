import { DeviceDBManager } from '../types/DeviceDB';
import { Device } from '../types/Device';
export class DeviceService {

    constructor(private deviceDb: DeviceDBManager) { }

    public async GetDevice(deviceId: string): Promise<Device | undefined> {
        try {
            return await this.deviceDb.GetDevice(deviceId);
        } catch (error) {
            throw error;
        }
    }

    public async UpdateDevice(device: Device) {
        try {
            await this.deviceDb.UpdateDevice(device);
        } catch (error) {
            throw error;
        }
    }

    public async TriggerHearbeat(device: Device) {
        try {
            await this.deviceDb.UpdateDeviceHeartbeat(device.deviceId)
        } catch (error) {
            throw error;
        }
    }

    public async GetAllDevices(): Promise<Device[]> {
        try {
            return await this.deviceDb.GetDevices();
        } catch (error) {
            throw error;
        }
    }

    public async GetDevicesByType(type: string): Promise<Device[]> {
        try {
            return await this.deviceDb.GetDevicesByType(type);
        } catch (error) {
            throw error;
        }
    }


}