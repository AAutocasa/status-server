import { MQTTPublisher, MQTTQoS } from '../mqtt';
import { Device, DeviceDBManager, DeviceStatus, FirmwareRole, DeviceHeartbeat, DeviceInfo, HTTP422Error } from '../types';
import { FirmwareService } from '.';
import moment from 'moment';
export class DeviceService {
    readonly prefix = `[DeviceService]`;

    constructor(private deviceDb: DeviceDBManager,
                private mqttPublisher: MQTTPublisher,
                private firmwareSvc: FirmwareService) { }

    public async GetDevice(deviceId: string): Promise<Device | undefined> {
        try {
            // console.log(`${this.prefix} GetDevice called with ${deviceId}`);
            return await this.deviceDb.GetDevice(deviceId);
        } catch (error) {
            throw error;
        }
    }

    public async UpdateDevice(device: Device): Promise<void> {
        try {
            await this.deviceDb.UpdateDevice(device);
        } catch (error) {
            throw error;
        }
    }

    public async DeleteDevice(deviceId: string): Promise<void> {
        try {
            await this.deviceDb.RemoveDevice(deviceId);
        } catch (error) {
            throw error;
        }
    }

    public async ProcessHeartbeat(heartbeat: DeviceHeartbeat): Promise<void> {
        try {
            // console.log(`${this.prefix} TriggerHeartbeat called with ${heartbeat.deviceId}`);
            const existingDevice = await this.GetDevice(heartbeat.id);

            if (existingDevice) {
                // console.log(`${this.prefix} Device already exists. Updating heartbeat`);
                const updatedDevice = Object.assign(existingDevice, 
                    { 
                        type: heartbeat.type, 
                        firmware: heartbeat.firmware,
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

    public async ActivateDevice(deviceId: string): Promise<void> {
        try {
            console.log(`${this.prefix} Activate called with id ${deviceId}`);
            const device = await this.deviceDb.GetDevice(deviceId);

            if (!device) {
                throw new HTTP422Error(`No device with the received ID exists`);
            }

            device.status = DeviceStatus.Unknown;
            this.deviceDb.UpdateDevice(device);
            console.log(`   ${this.prefix} Publishing to mqtt!`);
            this.mqttPublisher.publishJSON(`status-device/activate`, { deviceId: deviceId }, { qos: MQTTQoS.AT_LEAST_ONCE }); 
        } catch (error) {
            throw error;
        }
    }

    public async DeactivateDevice(deviceId: string): Promise<void> {
        try {
            console.log(`${this.prefix} Deactivate called with id ${deviceId}`);
            const device = await this.deviceDb.GetDevice(deviceId);

            if (!device) {
                throw new HTTP422Error(`No device with the received ID exists`);
            }

            device.status = DeviceStatus.Unknown;
            this.deviceDb.UpdateDevice(device);
            console.log(`   ${this.prefix} Publishing to mqtt!`);
            this.mqttPublisher.publishJSON(`status-device/deactivate`, { deviceId: deviceId }, { qos: MQTTQoS.AT_LEAST_ONCE });       
        } catch (error) {
            throw error;
        }
    }

    public async SetDeviceRole(deviceId: string, role: FirmwareRole): Promise<boolean> {
        try {
            console.log(`${this.prefix} SetDeviceRole called with id ${deviceId}, role ${role}`);
            const device = await this.deviceDb.GetDevice(deviceId);

            if (!device) {
                throw new HTTP422Error(`No device with the received ID exists`);
            }

            const firmware = device.firmware;
            const isValid = await this.firmwareSvc.ValidateFirmwareRole(firmware, role)
            
            if (!isValid) {
                throw new HTTP422Error(`The received role is not valid for the device firmware`);
            }

            console.log(role);
            console.log(typeof role);

            // TODO: Figure out why the fuck the type of role is string and I need to typecast
            const updatedDevice = Object.assign(device, { role: role })
            this.deviceDb.UpdateDevice(updatedDevice);

            console.log(`   ${this.prefix} Publishing to mqtt!`);
            this.mqttPublisher.publishJSON(`status-device/firmware-role`, { deviceId: deviceId, role: role }, { qos: MQTTQoS.AT_LEAST_ONCE });

            return true;
        } catch (error) {
            throw error;
        }
    }


    public async SetDeviceInfo(deviceId: string, info: DeviceInfo): Promise<void> {
        try {
            console.log(`${this.prefix} SetDeviceInfo called with id ${deviceId}, info: `);
            console.log(info);

            const device = await this.deviceDb.GetDevice(deviceId);

            if (!device) {
                throw new HTTP422Error(`No device with the received ID exists`);
            }

            const tag = info.tag
            if (tag) {
                Object.assign(device, { tag })
            }

            const location = info.location
            if (location) {
                Object.assign(device, { location })
            }

            const group = info.group
            if (group) {
                Object.assign(device, { group })
            }
            
            this.deviceDb.UpdateDevice(device);
        } catch (error) {
            throw error;
        }
    }


}