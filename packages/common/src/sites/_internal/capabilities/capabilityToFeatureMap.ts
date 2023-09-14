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
    capability: "hideFollow",
    feature: "hub:site:feature:follow",
    negate: true,
  },
];
