import type { IArcGISContext } from "../../types/IArcGISContext";
import { IPermissionPolicy } from "../types/IPermissionPolicy";
import { IPolicyCheck } from "../types/IPolicyCheck";
import { PolicyResponse } from "../types/PolicyResponse";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * Validate license policy
 * @param policy
 * @param response
 * @param context
 * @returns
 */
export function checkLicense(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  _entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];
  // Only return a check if the policy is defined
  if (policy.licenses?.length) {
    let result: PolicyResponse = "granted";

    if (!policy.licenses.includes(context.hubLicense)) {
      result = "not-available";
      // can we show an upgrade ux?
      if (
        policy.licenses[0] === "hub-premium" &&
        context.hubLicense === "hub-basic"
      ) {
        result = "not-licensed"; // implies it could be licensed
      }
    }

    const check: IPolicyCheck = {
      name: `license in ${policy.licenses.join(", ")}`,
      value: context.hubLicense,
      code: getPolicyResponseCode(result),
      response: result,
    };
    checks.push(check);
  }
  return checks;
}
