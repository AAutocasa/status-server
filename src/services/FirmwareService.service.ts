import { FirmwareDBManager, FirmwareInfo, FirmwareRole, FirmwareType } from "../types";

export class FirmwareService {
    readonly prefix = `[FirmwareService]`;

    constructor(private firmwareDb: FirmwareDBManager) { }

    public async GetFirmwares(): Promise<FirmwareInfo[]> {
        const firmwares = await this.firmwareDb.GetFirmwares();
        return firmwares; 
    }

    public async ValidateFirmwareRole(type: FirmwareType, role: FirmwareRole): Promise<boolean> {
        const roles = await this.firmwareDb.GetRoleInfos(type);
        const roleCodes = roles.map(r => r.roleCode);
        return roleCodes.filter(r => r == role).length != 0; 
    }

}