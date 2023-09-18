import { SitePermissions } from "../SiteBusinessRules";

/**
 * legacy site capabilities
 */
export type LegacyCapability = "hideFollow" | "disableDiscussions";

/**
 * representation of legacy site capabilities as
 * feature flags
 */
export interface ILegacyCapabilityFeatureFlags
  extends Partial<Record<LegacyCapability, boolean>> {}

/**
 * capability to feature map entry that provides a
 * "cross-walk" between a legacy site capability
 * and site feature (using the new permissions
 * system)
 *
 * This enables us to convert/migrate capabilities
 * to features when sites are fetched and updated
 */
export interface ICapabilityToFeatureMap {
  capability: LegacyCapability;
  feature: (typeof SitePermissions)[number];
  /**
   * whether to apply a ! when converting between the
   * capability and feature
   */
  negate?: boolean;
}
