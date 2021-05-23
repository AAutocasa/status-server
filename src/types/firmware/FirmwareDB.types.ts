import { FirmwareRole, FirmwareType } from "..";

export interface FirmwareDBManager {
    GetRoles(type: FirmwareType): Promise<FirmwareRole[]>;
}