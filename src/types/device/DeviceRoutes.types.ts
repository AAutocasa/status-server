import { Device, CapabilityCode, CapabilityRole  } from "..";

export type DeviceHeartbeat = Pick<Device, "id" | "type" | "status"> & {
    capabilities: [{
        code: CapabilityCode,
        roleCode: CapabilityRole
    }]
};

export type DeviceRoleAssignment = {
    capabilities: [{
        code: CapabilityCode,
        roleCode: CapabilityRole
    }];
}

export type DeviceInfo = Pick<Device, "tag" | "group" | "location">