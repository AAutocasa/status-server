import { Capability, CapabilityCode } from "..";

export interface CapabilityDBManager {
    GetCapabilities(): Promise<Capability[]>;
    GetCapability(code: CapabilityCode): Promise<Capability | undefined>;
    UpdateCapability(capability: Capability): void;
}