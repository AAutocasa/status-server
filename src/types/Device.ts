export type Device = {
    deviceId: string,
    deviceType: string,
    status: DeviceStatus,

    /** UTC, ms */
    lastHeartbeat: number,
};

export enum DeviceStatus {
    Active = 0,
    Inactive = 1
};