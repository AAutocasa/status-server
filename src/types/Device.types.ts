import { FirmwareType, FirmwareRole } from './Firmware.types';

export type Device = {
    /* ======= Immutable properties (from the server-side) */
    /** Device ID, set on the device */
    id: string,

    /** Device type (ESP8266, others) */
    type: string,

    /** Current applied firmware (RGB_STRIPE, RGB_MATRIX, COFFEE_POT) */
    firmware: FirmwareType,

    /** Device ID, set on the device (v1.2) */
    firmwareVersion: string,

    /* ======= Mutable properties that are kept only on the server */
    /** Friendly-name to the device */
    tag?: string,

    /** Group ("WINDOWS", "RGB", ...) */
    group?: string,

    /** Location ("BEDROOM", "LIVING_ROOM", ...) */
    location?: string,

    /* ======= Mutable properties that are set to the device */
    /** Active or inactive */
    status: DeviceStatus,

    /** Role of the device, needs to be allowed by the firmware */
    role?: FirmwareRole,

    /* ======= Other */
    /** Last time device pinged the server. UTC, ms */
    lastHeartbeat: number,
};

export enum DeviceStatus {
    Unknown = -1,
    Active = 0,
    Inactive = 1
};