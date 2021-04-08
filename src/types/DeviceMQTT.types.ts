import { Device } from ".";

export type Heartbeat = Pick<Device, "id" | "type" | "firmwareType" | "firmwareVersion" | "status">;
export type RoleAssignment = Pick<Device, "id" | "role">