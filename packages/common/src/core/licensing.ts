import { HubCapability } from "./configuration/HubCapabilities";

/**
 * Defines the values for hub license types
 */
export type HubLicense = "basic" | "premium" | "enterprise";

export interface ILicenseStatus {
  available: boolean;
  licensed: boolean;
}

export interface IPlatformLicenseStatus {
  context: string;
  capabilities: HubCapabilityLicenseStatus;
}

export type HubCapabilityLicenseStatus = {
  [key in HubCapability]: ILicenseStatus;
};
