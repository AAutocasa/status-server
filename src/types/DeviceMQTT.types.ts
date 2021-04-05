import { DeviceStatus } from "./Device.types";

export type Heartbeat = {
    deviceId: string,
    deviceType: string,
    status: DeviceStatus,
}