import { Device } from ".";

export type Heartbeat = Pick<Device, "id" | "type" | "firmwareType" | "firmwareVersion" | "status">;