import { MQTTPublisher, MQTTQoS } from '../mqtt';
import { Device, DeviceDBManager, DeviceStatus, Heartbeat } from '../types';
import moment from 'moment';
export class DeviceService {
    readonly prefix = `[DeviceService]`;

    constructor(private deviceDb: DeviceDBManager,
                private mqttPublisher: MQTTPublisher) { }

    public async GetDevice(deviceId: string): Promise<Device | undefined> {
        try {
            // console.log(`${this.prefix} GetDevice called with ${deviceId}`);
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

    public async ProcessHeartbeat(heartbeat: Heartbeat) {
        try {
            // console.log(`${this.prefix} TriggerHeartbeat called with ${heartbeat.deviceId}`);
            const existingDevice = await this.GetDevice(heartbeat.id);

            if (existingDevice) {
                // console.log(`${this.prefix} Device already exists. Updating heartbeat`);
                const updatedDevice = Object.assign(existingDevice, 
                    { 
                        type: heartbeat.type, 
                        firmwareType: heartbeat.firmwareType,
                        firmwareVersion: heartbeat.firmwareVersion,
                        status: heartbeat.status ,
                        lastHeartbeat: moment().valueOf()
                    });
                await this.UpdateDevice(updatedDevice)
            } else {
                // console.log(`${this.prefix} No device... creating it!`);
                const newDevice = Object.assign(heartbeat, { lastHeartbeat: moment().valueOf() })
                await this.UpdateDevice(newDevice)
            }
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

    public async ActivateDevice(deviceId: string) {
        try {
            console.log(`${this.prefix} Activate called with id ${deviceId}`);
            const device = await this.deviceDb.GetDevice(deviceId);
            if (device) {
                device.status = DeviceStatus.Unknown;
                this.deviceDb.UpdateDevice(device);
                console.log(`   ${this.prefix} Publishing to mqtt!`);
                this.mqttPublisher.publishJSON(`status-device/activate`, { deviceId: deviceId }, { qos: MQTTQoS.AT_LEAST_ONCE });
            }
        } catch (error) {
            throw error;
        }
    }

    public async DeactivateDevice(deviceId: string) {
        try {
            console.log(`${this.prefix} Deactivate called with id ${deviceId}`);
            const device = await this.deviceDb.GetDevice(deviceId);
            if (device) {
                device.status = DeviceStatus.Unknown;
                this.deviceDb.UpdateDevice(device);
                console.log(`   ${this.prefix} Publishing to mqtt!`);
                this.mqttPublisher.publishJSON(`status-device/deactivate`, { deviceId: deviceId }, { qos: MQTTQoS.AT_LEAST_ONCE });
            }
        } catch (error) {
            throw error;
        }
    }


}