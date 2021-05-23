import { Device } from "..";

export type DeviceHeartbeat = Pick<Device, "id" | "type" | "firmware" | "firmwareVersion" | "status">;
export type DeviceRoleAssignment = Pick<Device, "role">
export type DeviceInfo = Pick<Device, "tag" | "group" | "location">