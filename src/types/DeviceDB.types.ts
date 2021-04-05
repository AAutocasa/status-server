import { Device } from './Device.types';

export interface DeviceDBManager {
    UpdateDeviceHeartbeat(deviceId: string): void;

    UpdateDevice(device: Device): void;
    RemoveDevice(deviceId: string): void;

    GetDevice(deviceId: string): Promise<Device | undefined>;
    GetDevicesByType(type: string): Promise<Device[]>;
    GetDevices(): Promise<Device[]>;
}