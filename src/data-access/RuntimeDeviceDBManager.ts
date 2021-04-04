import moment from 'moment';
import { DeviceDBManager } from '../types/DeviceDB';
import { Device } from '../types/Device';

export class RuntimeDeviceDBManager implements DeviceDBManager {

    private _devices: { [deviceId: string]: { device: Device } } = {};

    UpdateDevice(device: Device): void {
        this._devices[device.deviceId] = { device };
    }

    RemoveDevice(deviceId: string): void {
        delete this._devices[deviceId];
    }

    UpdateDeviceHeartbeat(deviceId: string): void {
        if (this._devices[deviceId].device) {
            this._devices[deviceId].device.lastHearbeat = moment().valueOf();;
        }
    }

    GetDevice(deviceId: string): Promise<Device | undefined> {
        return new Promise((resolve, reject) => {
            resolve(this._devices[deviceId].device);
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
            resolve(Object.values(this._devices).map(d => d.device));
        });
    }
}