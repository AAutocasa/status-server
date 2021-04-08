import { FirmwareDBManager, FirmwareRole, FirmwareType } from "../types";

export class StaticFirmwareDBManager implements FirmwareDBManager {
    readonly prefix = `[StaticFirmwareDeviceDBManager]`;

    private _roles: { [type in FirmwareType]: { roles: FirmwareRole[] } } = {
        0: {  // RGB
            roles: [
                FirmwareRole.RGB_MATRIX, 
                FirmwareRole.RGB_STRIPE
            ]
        }
    };

    GetRoles(type: FirmwareType): Promise<FirmwareRole[]> {
        return new Promise((resolve, reject) => {
            const array = this._roles[type].roles;
            resolve(array);
        });         
    }
}