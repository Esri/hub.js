import { IFeatureFlags } from "../types/IPermissionPolicy";
import { Permission } from "../types/Permission";

/**
 * Take an entity's features and merge them with the default features ensuring
 * that only the featires defined in the business rules are allowed through.
 * @param entityFeatures
 * @param defaultFeatures
 * @returns
 */
export function processEntityFeatures(
  entityFeatures: IFeatureFlags,
  defaultFeatures: IFeatureFlags
): IFeatureFlags {
  // Extend the defaults with the entity values
  const features = { ...defaultFeatures, ...entityFeatures };

  // Remove any features that are not in the default features hash.
  // this prevents enabling features that are not defined in hub business rules
  const defaultKeys = Object.keys(defaultFeatures);
  const keysToRemove = Object.keys(features).reduce((acc, key) => {
    if (!defaultKeys.includes(key)) {
      acc.push(key as Permission);
    }
    return acc;
  }, []);
  // remove any keys that are not in the default hash
  keysToRemove.forEach((key: Permission) => {
    delete features[key];
  });
  return features;
}
