import { Capability, CapabilityRole } from '../capability/Capability.types';

export type Device = {
    /* ======= Immutable properties (from the server-side) */
    /** Device ID, set on the device */
    id: string,

    /** Device type (ESP8266, others) */
    type: string,

    /* ======= Mutable properties that are kept only on the server */
    /** Friendly-name to the device */
    tag?: string,

    /** Group ("WINDOWS", "RGB", ...) */
    group?: string,

    /** Location ("BEDROOM", "LIVING_ROOM", ...) */
    location?: string,

    /* ======= Mutable properties that are (partially or totally) set to the device */
    /** Active or inactive */
    status: DeviceStatus,

    /** The capabilities and active roles the device has */
    capabilities: Capability[];

    /* ======= Other */
    /** Last time device pinged the server. UTC, ms */
    lastHeartbeat: number,
};

export enum DeviceStatus {
    Unknown = -1,
    Active = 0,
    Inactive = 1
}

export type DeviceCapability = Capability & {
    version: string;
    activeRole: CapabilityRole;
}