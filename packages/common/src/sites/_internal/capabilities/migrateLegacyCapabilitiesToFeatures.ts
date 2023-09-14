import { getProp, setProp } from "../../../objects";
import { IFeatureFlags } from "../../../permissions";
import { IModel } from "../../../types";
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
 * system and expose them on the entity
 *
 * This function is called within fetchSite to ensure all
 * sites have features that are kept up-to-date with the
 * legacy capabilities array
 */
export const migrateLegacyCapabilitiesToFeatures = (model: IModel): IModel => {
  const legacyCapabilityFeatureFlags: ILegacyCapabilityFeatureFlags = {};
  let updatedFeatures: IFeatureFlags = {};

  // 1. convert legacy capabilities to a feature flag hash
  (getProp(model, "data.values.capabilities") || []).forEach(
    (capability: LegacyCapability) => {
      legacyCapabilityFeatureFlags[capability] = true;
    }
  );

  // 2. update/add features based on the legacy capabilities array
  const currentFeatures = getProp(model, "data.settings.features") || {};
  updatedFeatures = capabilityToFeatureMap.reduce(
    (features: IFeatureFlags, map: ICapabilityToFeatureMap) => {
      // TODO: remove istanbul exception once we include a
      // legacy capability that satisfies the second condition
      /* istanbul ignore next */
      const capabilityFlag = map.negate
        ? !legacyCapabilityFeatureFlags[map.capability]
        : legacyCapabilityFeatureFlags[map.capability];

      return {
        ...features,
        [map.feature]: capabilityFlag,
      };
    },
    currentFeatures
  );

  setProp("data.settings.features", updatedFeatures, model);

  return model;
};
