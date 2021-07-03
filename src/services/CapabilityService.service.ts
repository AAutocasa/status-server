import { Capability, CapabilityCode, CapabilityDBManager, CapabilityRoleCode } from "../types";

export class CapabilityService {
    readonly prefix = `[CapabilityService]`;

    constructor(private capabilitiesDb: CapabilityDBManager) { }

    public async GetCapabilities(): Promise<Capability[]> {
        const capabilities = await this.capabilitiesDb.GetCapabilities();
        return capabilities; 
    }

    public async GetCapabilitiesWithCodes(codes: CapabilityCode[]): Promise<Capability[]> {
        const capabilities = await this.capabilitiesDb.GetCapabilities();
        return capabilities.filter(c => codes.includes(c.code));
    }
    
    public async ValidateRoleCapability(capabilityCode: CapabilityCode, roleCode: CapabilityRoleCode): Promise<boolean> {
        const capabilities = await this.capabilitiesDb.GetCapabilities();
        const capability = capabilities.find(c => c.code == capabilityCode);

        if (!capability) { return false; }

        const validRole = capability.possibleRoles.find(r => r.code == roleCode);
        return !!validRole
    }
}