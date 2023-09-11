import { IFeatureFlags, IPermissionPolicy } from "../../permissions";

/**
 * Default features for an Initiative Template. These are the features that can be enabled / disabled by the entity owner
 */
export const InitiativeTemplateDefaultFeatures: IFeatureFlags = {
  // TODO
};

/**
 * Initiative Template Permission Policies
 * These define the requirements any user must meet to perform related actions
 * @private
 */
export const InitiativeTemplatePermissions = [
  "hub:initiativeTemplate",
  // TODO
] as const;

/**
 * Initiative Template policies
 * @private
 */
export const InitiativeTemplatePermissionPolicies: IPermissionPolicy[] = [
  // TODO
];
