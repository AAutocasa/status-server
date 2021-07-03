export enum CapabilityCode {
    RGB = 0,
}

export enum CapabilityRoleCode {
    RGB_STRIPE = 0,
    RGB_MATRIX = 1,
}

export type CapabilityRole = {
    name: string;
    code: CapabilityRoleCode;
}

export type Capability = {
    name: string;
    code: CapabilityCode;
    possibleRoles: CapabilityRole[];
}
