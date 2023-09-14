import { IModel } from "../../../types";
import { getProp } from "../../../objects/get-prop";
import { capabilityToFeatureMap } from "./capabilityToFeatureMap";
import {
  ICapabilityToFeatureMap,
  ILegacyCapabilityFeatureFlags,
  LegacyCapability,
} from "./types";

/**
 * Site capabilities are currently saved as an array on the
 * site.data.values.capabilities. We want to migragte these
 * legacy capabilities over to features in the new permissions
 * system; however, we must continue persisting updates to
 * these features in the legacy capabilities array until the
 * existing site capabilities in our application are plumbed
 * to work off of permissions
 *
 * This function is called within updateSite to ensure
 * the legacy capabilities array is kept up-to-date
 *
 * TODO: Remove once site capabilities use permissions
 *
 * @param modelToUpdate
 * @param currentModel
 */
export const convertFeaturesToLegacyCapabilities = (
  modelToUpdate: IModel,
  currentModel: IModel
): IModel => {
  let legacyCapabilityFeatureFlags: ILegacyCapabilityFeatureFlags = {};

  // 1. convert legacy capabilities to a feature flag hash
  (getProp(currentModel, "data.values.capabilities") || []).forEach(
    (capability: LegacyCapability) => {
      legacyCapabilityFeatureFlags[capability] = true;
    }
  );

  // 2. override legacy capabilities that are driven by features
  const features = getProp(modelToUpdate, "data.settings.features") || {};
  legacyCapabilityFeatureFlags = capabilityToFeatureMap.reduce(
    (
      capabilities: ILegacyCapabilityFeatureFlags,
      map: ICapabilityToFeatureMap
    ) => {
      // TODO: remove istanbul exception once we include a
      // legacy capability that satisfies the second condition
      /* istanbul ignore next */
      const featureFlag = map.negate
        ? !features[map.feature]
        : features[map.feature];

      return {
        ...capabilities,
        [map.capability]: featureFlag,
      };
    },
    legacyCapabilityFeatureFlags
  );

  // 3. convert legacy capabilities back to an array and persist on model
  modelToUpdate.data.values.capabilities = Object.entries(
    legacyCapabilityFeatureFlags
  ).reduce((acc, [key, value]) => {
    value && acc.push(key);
    return acc;
  }, []);

  return modelToUpdate;
};
