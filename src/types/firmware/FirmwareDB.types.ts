import { FirmwareInfo, FirmwareRoleInfo, FirmwareType } from "..";

export interface FirmwareDBManager {
    GetFirmwares(): Promise<FirmwareInfo[]>;
    GetFirmwareInfo(type: FirmwareType): Promise<FirmwareInfo | undefined>;
    GetRoleInfos(type: FirmwareType): Promise<FirmwareRoleInfo[]>;
}