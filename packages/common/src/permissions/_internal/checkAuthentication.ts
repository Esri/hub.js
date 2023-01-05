import { IArcGISContext } from "../../ArcGISContext";
import { IPermissionPolicy, PolicyResponse, IPolicyCheck } from "../types";
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
  entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];

  // Only return a check if the policy is defined
  if (policy.hasOwnProperty("authenticated")) {
    let response: PolicyResponse = "granted";

    if (policy.authenticated && !context.isAuthenticated) {
      response = "not-authenticated";
    }

    // create the check
    const check: IPolicyCheck = {
      name: "authentication",
      value: `required: ${policy.authenticated}`,
      code: getPolicyResponseCode(response),
      response,
    };
    checks.push(check);
  }
  return checks;
}
