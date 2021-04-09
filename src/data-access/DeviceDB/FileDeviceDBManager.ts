import { Device, DeviceDBManager } from '../../types';
const fs = require('fs');
const fse = require('fs-extra');


export class FileDeviceDBManager implements DeviceDBManager {
    readonly prefix = `[FileDeviceDBManager]`;

    constructor(filePath: string) {
        this._filePath = filePath;
        this.ReadDB(filePath);
    }

    private _filePath: string
    private _devices: { [deviceId: string]: { device: Device } } = {};

    private ReadDB(filePath: string) {
        const prefix = this.prefix

        fse.readJson(filePath, (err: any, data: any) => {
            if (err) { 
                console.log(`${prefix} ReadDB error: ${err}. Creating file...!`);
                this.PersistDB(filePath);
                console.log(`${prefix} Created file...!`);
            }
            this._devices = data;
        })
    }

    private PersistDB(filePath: string) {
        const prefix = this.prefix

        fse.writeJson(filePath, this._devices, (err: any) => {
            if (err) {
                return console.log(`${prefix} PersistDB error: ${err}`);
            }
        })
    }

    UpdateDevice(device: Device): void {
        // console.log(`${this.prefix} UpdateDevice called with:`);
        // console.log(device);
        this._devices[device.id] = { device };
        this.PersistDB(this._filePath);
    }

    RemoveDevice(deviceId: string): void {
        delete this._devices[deviceId];
        this.PersistDB(this._filePath);
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
                                .filter(d => d.type == type);
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