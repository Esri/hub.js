import { IArcGISContext } from "../../types/IArcGISContext";
import { IPermissionPolicy } from "../types/IPermissionPolicy";
import { IPolicyCheck } from "../types/IPolicyCheck";
import { PolicyResponse } from "../types/PolicyResponse";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * @internal
 * Verify that the policy.releaseAfter and policy.retireAfter requirements are met.
 * These checks only apply in the "production" environment.
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkReleaseGating(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  _entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];

  // if neither value is specified, we return an empty array
  if (!policy.releaseAfter && !policy.retireAfter) {
    return checks;
  }
  // We only apply release gating in the production environment
  if (context.environment === "production") {
    const now = new Date();

    if (policy.releaseAfter) {
      const releaseDate = new Date(policy.releaseAfter);
      let result: PolicyResponse = "release-date-not-reached";
      if (now > releaseDate) {
        result = "granted";
      }
      const check: IPolicyCheck = {
        name: `feature released`,
        value: policy.releaseAfter,
        code: getPolicyResponseCode(result),
        response: result,
      };
      checks.push(check);
    }

    if (policy.retireAfter) {
      const retireDate = new Date(policy.retireAfter);
      let result: PolicyResponse = "retire-date-not-reached";
      if (now > retireDate) {
        result = "granted";
      }
      const check: IPolicyCheck = {
        name: `feature retired`,
        value: policy.retireAfter,
        code: getPolicyResponseCode(result),
        response: result,
      };
      checks.push(check);
    }
  } else {
    // if not in production, we always grant access
    const check: IPolicyCheck = {
      name: `release gating only applies to production`,
      value: policy.releaseAfter,
      code: getPolicyResponseCode("granted"),
      response: "granted",
    };
    checks.push(check);
  }

  return checks;
}
