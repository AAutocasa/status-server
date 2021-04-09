import { Device } from ".";

export type DeviceHeartbeat = Pick<Device, "id" | "type" | "firmwareType" | "firmwareVersion" | "status">;
export type DeviceRoleAssignment = Pick<Device, "id" | "role">
export type DeviceInfo = Pick<Device, "id" | "tag" | "group" | "location">