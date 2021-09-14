import { MQTTPublisher, MQTTQoS } from '../mqtt';
import { Device, DeviceDBManager, DeviceStatus, DeviceHeartbeat, DeviceInfo, HTTP422Error } from '../types';
import { CapabilityService } from '.';
import moment from 'moment';
import { DeviceCapability } from '../types';
import { CapabilityCode, CapabilityRoleCode } from '../types/capability/Capability.types';
export class DeviceService {
    readonly prefix = `[DeviceService]`;

    constructor(private deviceDb: DeviceDBManager,
                private mqttPublisher: MQTTPublisher,
                private capabilitySvc: CapabilityService) { }

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

            // Build capabilities
            let deviceCapabilities: DeviceCapability[] = [];

            if (heartbeat.capabilities) {
                const codes = heartbeat.capabilities.map(c => c.code);
    
                const capabilities = await this.capabilitySvc.GetCapabilitiesWithCodes(codes);
                capabilities.sort((a, b) => a.code - b.code);
    
                const heartbeatCapabilities = heartbeat.capabilities.filter(hb => capabilities.map(c => c.code).includes(hb.code));
                heartbeatCapabilities.sort((a, b) => a.code - b.code);
    
                deviceCapabilities = capabilities.map((c, i) => {
                    const heartbeatInfo = heartbeatCapabilities[i];
                    return <DeviceCapability>{
                        name: c.name,
                        code: c.code,
                        possibleRoles: c.possibleRoles,
                        activeRoleCode: heartbeatInfo.activeRole,
                        version: heartbeatInfo.version
                    }
                })
            }

            if (existingDevice) {
                // console.log(`${this.prefix} Device already exists. Updating heartbeat`);
                const updatedDevice = Object.assign(existingDevice, 
                    { 
                        type: heartbeat.type, 
                        status: heartbeat.status ,
                        lastHeartbeat: moment().valueOf(),
                        capabilities: deviceCapabilities,
                    });
                await this.UpdateDevice(updatedDevice)
            } else {
                // console.log(`${this.prefix} No device... creating it!`);
                const newDevice = <Device>{ 
                    id: heartbeat.id,
                    status: heartbeat.status,
                    type: heartbeat.type,
                    lastHeartbeat: moment().valueOf(),
                    capabilities: deviceCapabilities
                 }
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

            device.status = DeviceStatus.Active;
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

            device.status = DeviceStatus.Inactive;
            this.deviceDb.UpdateDevice(device);
            console.log(`   ${this.prefix} Publishing to mqtt!`);
            this.mqttPublisher.publishJSON(`status-device/deactivate`, { deviceId: deviceId }, { qos: MQTTQoS.AT_LEAST_ONCE });       
        } catch (error) {
            throw error;
        }
    }

    public async SetDeviceRole(deviceId: string, code: CapabilityCode, roleCode: CapabilityRoleCode): Promise<boolean> {
        try {
            console.log(`${this.prefix} SetDeviceRole called with id ${deviceId}, code ${code}, roleCode ${roleCode}`);
            const device = await this.deviceDb.GetDevice(deviceId);

            if (!device) {
                throw new HTTP422Error(`No device with the received ID exists`);
            }

            const capabilities = device.capabilities;
            const index = capabilities.findIndex(c => c.code == code);
            if (index < 0) {
                throw new HTTP422Error(`The device doesn't have that capability`);
            }
            
            const capability = capabilities[index];
            const isValid = await this.capabilitySvc.ValidateRoleCapability(code, roleCode);
            if (!isValid) {
                throw new HTTP422Error(`The received role is not valid for the device firmware`);
            }

            capability.activeRoleCode = roleCode
            device.capabilities[index] = capability;
            
            this.deviceDb.UpdateDevice(device);

            console.log(`   ${this.prefix} Publishing to mqtt!`);
            this.mqttPublisher.publishJSON(`status-device/capability-role`, { deviceId: deviceId, code, roleCode }, { qos: MQTTQoS.AT_LEAST_ONCE });

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