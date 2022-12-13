import { IArcGISContext } from "../../ArcGISContext";
import { HubEntity } from "../../core";
import { IPermissionPolicy, PolicyResponse, IPolicyCheck } from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * Validate entityOwner policy
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkAlphaGating(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];
  // Only return a check if the policy is defined
  if (policy.alpha) {
    const result: PolicyResponse = context.isAlphaOrg
      ? "granted"
      : "not-alpha-org";

    // create the check
    const check: IPolicyCheck = {
      name: `user in alpha org`,
      value: context.hubLicense,
      code: getPolicyResponseCode(result),
      response: result,
    };
    checks.push(check);
  }

  return checks;
}
