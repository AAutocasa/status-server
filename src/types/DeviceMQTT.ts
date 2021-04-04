import { DeviceStatus } from "./Device";

export type Heartbeat = {
    deviceId: string,
    deviceType: string,
    status: DeviceStatus,
}