import { SitePermissions } from "../SiteBusinessRules";

export type LegacyCapability = "hideFollow";

export interface ILegacyCapabilityFeatureFlags
  extends Partial<Record<LegacyCapability, boolean>> {}

export interface ICapabilityToFeatureMap {
  capability: LegacyCapability;
  feature: (typeof SitePermissions)[number];
  /**
   * whether to apply a ! when converting between the
   * capability and feature
   */
  negate?: boolean;
}
