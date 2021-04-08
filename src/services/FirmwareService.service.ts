import { FirmwareDBManager, FirmwareRole, FirmwareType } from "../types";

export class FirmwareService {
    readonly prefix = `[FirmwareService]`;

    constructor(private firmwareDb: FirmwareDBManager) { }

    public async ValidateFirmwareRole(type: FirmwareType, role: FirmwareRole) {
        const roles = await this.firmwareDb.GetRoles(type);
        return roles.filter(r => r == role).length != 0; 
    }

}