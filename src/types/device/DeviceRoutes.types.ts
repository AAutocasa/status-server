import { Device, CapabilityCode, CapabilityRoleCode  } from "..";

export type DeviceHeartbeat = Pick<Device, "id" | "type" | "status"> & {
    capabilities: [{
        code: CapabilityCode,
        activeRole: CapabilityRoleCode,
        version: string
    }]
};

export type DeviceRoleAssignment = {
    capabilities: [{
        code: CapabilityCode,
        activeRole: CapabilityRoleCode,
        version: string
    }];
}

export type DeviceInfo = Pick<Device, "tag" | "group" | "location">