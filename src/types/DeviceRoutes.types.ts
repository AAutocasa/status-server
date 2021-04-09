import { Device } from ".";

export type DeviceHeartbeat = Pick<Device, "id" | "type" | "firmwareType" | "firmwareVersion" | "status">;
export type DeviceRoleAssignment = Pick<Device, "role">
export type DeviceInfo = Pick<Device, "tag" | "group" | "location">