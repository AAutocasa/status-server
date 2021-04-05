import moment from 'moment';
import { Device, DeviceDBManager } from '../types';

export class RuntimeDeviceDBManager implements DeviceDBManager {
    readonly prefix = `[RuntimeDeviceDBManager]`;

    private _devices: { [deviceId: string]: { device: Device } } = {};

    UpdateDevice(device: Device): void {
        // console.log(`${this.prefix} UpdateDevice called with:`);
        // console.log(device);
        this._devices[device.deviceId] = { device };
    }

    RemoveDevice(deviceId: string): void {
        delete this._devices[deviceId];
    }

    UpdateDeviceHeartbeat(deviceId: string): void {
        // console.log(`${this.prefix} UpdateDeviceHeartbeat called with ${deviceId}`);
        if (this._devices[deviceId]) {
            this._devices[deviceId].device.lastHeartbeat = moment().valueOf();
        }
    }

    GetDevice(deviceId: string): Promise<Device | undefined> {
        return new Promise((resolve, reject) => {
            const device = this._devices[deviceId]
            if (device) {
                resolve(device.device);
            } else {
                resolve(undefined);
            }
        });          
    }

    GetDevicesByType(type: string): Promise<Device[]> {
        return new Promise((resolve, reject) => {
            const array = Object.values(this._devices)
                                .map(d => d.device)
                                .filter(d => d.deviceType == type);
            resolve(array);
        });          
    }

    GetDevices(): Promise<Device[]> {
        return new Promise((resolve, reject) => {
            // console.log(`${this.prefix} GetDevices called. Current devices:`);
            // console.log(this._devices);
            resolve(Object.values(this._devices).map(d => d.device));
        });
    }
}