import { IArcGISContext } from "../../ArcGISContext";
import {
  IAccessResponse,
  IPermissionPolicy,
  IPolicyCheck,
  PolicyResponse,
} from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * Check license for a system level policy
 * @param policy
 * @param response
 * @param context
 * @returns
 */

export function checkLicense(
  policy: IPermissionPolicy,
  context: IArcGISContext
): IPolicyCheck[] {
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

  return [check];
}
