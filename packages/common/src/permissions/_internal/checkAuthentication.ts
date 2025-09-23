import type { IArcGISContext } from "../../types/IArcGISContext";
import { IPermissionPolicy } from "../types/IPermissionPolicy";
import { IPolicyCheck } from "../types/IPolicyCheck";
import { PolicyResponse } from "../types/PolicyResponse";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * Validate authentication policy
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkAuthentication(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  _entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];

  // Only return a check if the policy is defined
  if (Object.prototype.hasOwnProperty.call(policy, "authenticated")) {
    let response: PolicyResponse = "granted";

    if (policy.authenticated && !context.isAuthenticated) {
      response = "not-authenticated";
    }

    // create the check
    const check: IPolicyCheck = {
      name: "authentication",
      value: `required: ${(!!policy.authenticated).toString()}`,
      code: getPolicyResponseCode(response),
      response,
    };
    checks.push(check);
  }
  return checks;
}
