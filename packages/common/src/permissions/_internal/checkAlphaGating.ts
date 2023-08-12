import { IArcGISContext } from "../../ArcGISContext";
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
  _entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];
  // Only return a check if the policy is defined
  if (policy.alpha) {
    /* tslint:disable-next-line: no-console */
    console.log(
      "DEPRECATED: alpha policy is deprecated, please use gatedAvailability: alpha instead"
    );

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
