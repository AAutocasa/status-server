export enum FirmwareType {
    RGB = 0,
}

export enum FirmwareRole {
    RGB_STRIPE = 0,
    RGB_MATRIX = 1,
}

export type FirmwareRoleInfo = {
    roleName: string;
    roleCode: FirmwareRole;
}

export type FirmwareInfo = {
    firmwareName: string;
    firmwareCode: FirmwareType;
    possibleRoles: FirmwareRoleInfo[];
}