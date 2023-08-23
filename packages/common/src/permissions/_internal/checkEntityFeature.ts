import { IArcGISContext } from "../../ArcGISContext";
import { getWithDefault } from "../../objects/get-with-default";
import { IFeatureFlags, IPermissionPolicy } from "../types/IPermissionPolicy";
import { IPolicyCheck } from "../types/IPolicyCheck";
import { PolicyResponse } from "../types/PolicyResponse";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

export function checkEntityFeature(
  policy: IPermissionPolicy,
  _entitycontext: IArcGISContext,
  entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];
  // Only check things if the policy can be configured by the entity
  // This prevents arbitrary checks from being overriden by the entity
  if (entity && policy.entityConfigurable) {
    const result = "feature-enabled" as PolicyResponse;
    // create the check, default to enabled
    const check: IPolicyCheck = {
      name: `entity feature enabled`,
      value: `entity feature ${policy.permission} check`,
      code: getPolicyResponseCode(result),
      response: result,
    };

    // Check if the feature is enabled for the entity defaulting to true
    const isFeatureEnabled = getWithDefault(
      entity,
      `features.${policy.permission}`,
      true
    );
    if (!isFeatureEnabled) {
      check.response = "feature-disabled";
      check.code = getPolicyResponseCode("feature-disabled");
    }
    checks.push(check);
  }
  return checks;
}
