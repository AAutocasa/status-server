import { FirmwareDBManager, FirmwareRole, FirmwareType } from "../types";
import { FirmwareInfo, FirmwareRoleInfo } from '../types/firmware/Firmware.types';

export class StaticFirmwareDBManager implements FirmwareDBManager {
    readonly prefix = `[StaticFirmwareDeviceDBManager]`;

    private _rolesInfos: { [firmwareName: string]: {info: FirmwareInfo} } = {
        RGB: { 
            info: <FirmwareInfo>{
                firmwareName: `RGB`,
                firmwareCode: FirmwareType.RGB,
                possibleRoles: [
                    <FirmwareRoleInfo>{
                        roleName: `RGB Matrix`,
                        roleCode: FirmwareRole.RGB_MATRIX
                    },
                    <FirmwareRoleInfo>{
                        roleName: `RGB Stripe`,
                        roleCode: FirmwareRole.RGB_STRIPE
                    }
                ]
            }
        },
    };

    GetFirmwares(): Promise<FirmwareInfo[]> {
        return new Promise((resolve, reject) => {
            const values = Object.values(this._rolesInfos).map(v => v.info);
            resolve(values || []);
        });         
    }

    GetFirmwareInfo(type: FirmwareType): Promise<FirmwareInfo | undefined> {
        return new Promise((resolve, reject) => {
            const values = Object.values(this._rolesInfos).map(v => v.info);
            const firmwareInfo = values.find(v => v.firmwareCode == type);
            resolve(firmwareInfo);
        });         
    }

    GetRoleInfos(type: FirmwareType): Promise<FirmwareRoleInfo[]> {
        return new Promise((resolve, reject) => {
            const values = Object.values(this._rolesInfos).map(v => v.info);
            const firmwareInfo = values.find(v => v.firmwareCode == type);
            const roles = firmwareInfo ? firmwareInfo.possibleRoles : [];
            resolve(roles);
        });         
    }

}