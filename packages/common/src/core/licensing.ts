import { HubCapability } from "./configuration/HubCapabilities";

/**
 * Defines the values for hub license types
 */
export type HubLicense = "hub-basic" | "hub-premium" | "enterprise-sites";

export interface ICapabilityLicenseStatus {
  /**
   * Capability is available in this environment, but may not be licenesed for the current user
   */
  available: boolean;
  /**
   * Capablility is available in this environment and is licenesed for the current user
   */
  licensed: boolean;
}

export interface IPlatformLicenseStatus {
  context: string;
  capabilities: CapabilityLicenseStatus;
}

export type CapabilityLicenseStatus = {
  [key in HubCapability]: ICapabilityLicenseStatus;
};
