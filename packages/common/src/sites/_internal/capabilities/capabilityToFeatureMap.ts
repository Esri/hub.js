import { ICapabilityToFeatureMap } from "./types";

/**
 * Returns an array of ICapabilityToFeatureMap objects
 * that define the projection of legacy capabilities
 * to permission features.
 *
 * We use this map to manage foward and backard conversions
 * and migration of legacy capablities to features when a
 * site is fetched or updated
 *
 * NOTE: if you are porting a legacy capability over to
 * workspaces, add it to this map
 */
export const capabilityToFeatureMap: ICapabilityToFeatureMap[] = [
  {
    /**
     * Currently if the hideFollow capability is present
     * on the site capabilities, the app interprets this
     * to mean following is disabled for the site, and
     * thus, in-page action "Follow" buttons are not
     * displayed. Permissions, however, are structured
     * in the positive, meaning that hub:site:feature:follow
     * should return true if following is enabled, and
     * false if it's disabled. We set "negate" to true
     * to handle this forward/backward discrepancy
     */
    capability: "hideFollow",
    feature: "hub:site:feature:follow",
    negate: true,
  },
  {
    capability: "disableDiscussions",
    feature: "hub:site:feature:discussions",
    negate: true,
  },
];
