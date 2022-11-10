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
    name: "license",
    value: policy.licenses.join(", "),
    code: getPolicyResponseCode(result),
    response: result,
  };
  // response.checks.push(check);
  // // only overwrite the response code/val if it's currently "granted"
  // // this allows the checks to be run in any order, and the first to
  // // revoke access will be the one that is returned, along with all the checks
  // if (response.response === 'granted'){
  //   response.code = getPolicyResponseCode(result);
  //   response.response = result;
  // }

  return [check];
}
