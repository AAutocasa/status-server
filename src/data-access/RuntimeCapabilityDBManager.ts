import { Capability, CapabilityCode, CapabilityDBManager, CapabilityRole, CapabilityRoleCode } from "../types";

export class RuntimeCapabilityDBManager implements CapabilityDBManager {
    readonly prefix = `[RuntimeCapabilityDeviceDBManager]`;

    private capabilities = [
        <Capability>{
            name: "RGB",
            code: CapabilityCode.RGB,
            possibleRoles: [
                <CapabilityRole>{
                    name: "RGB STRIPE",
                    code: CapabilityRoleCode.RGB_STRIPE
                },
                <CapabilityRole>{
                    name: "RGB MATRIX",
                    code: CapabilityRoleCode.RGB_MATRIX
                }
            ]
        },
    ];

    GetCapabilities(): Promise<Capability[]> {
        return new Promise((resolve, reject) => {
            resolve(this.capabilities);
        });         
    }

    GetCapability(code: CapabilityCode): Promise<Capability | undefined> {
        return new Promise((resolve, reject) => {
            resolve(this.capabilities.find(c => c.code = code));
        });         
    }

    UpdateCapability(capability: Capability): void {
        const index = this.capabilities.findIndex(c => c.code == capability.code);

        if (index >= 0) {
            this.capabilities[index] = capability;
        } else {
            this.capabilities.push(capability);
        }
    }
}