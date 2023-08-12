import { IArcGISContext } from "../../ArcGISContext";
import { checkPermission } from "../checkPermission";
import { IPermissionPolicy } from "../types/IPermissionPolicy";
import { IPolicyCheck } from "../types/IPolicyCheck";
import { PolicyResponse } from "../types/PolicyResponse";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * @internal
 * Verify that the gatedAvailability policy is met
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkAvailabilityGating(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  _entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];
  if (policy.gatedAvailability && policy.gatedAvailability !== "ga") {
    let result: PolicyResponse = "granted";

    if (policy.gatedAvailability === "alpha") {
      result = context.isAlphaOrg ? "granted" : "not-alpha-org";
    }

    if (policy.gatedAvailability === "beta") {
      result = context.isBetaOrg ? "granted" : "not-beta-org";
    }

    const check: IPolicyCheck = {
      name: `user in ${policy.gatedAvailability} org`,
      value: context.hubLicense,
      code: getPolicyResponseCode(result),
      response: result,
    };

    checks.push(check);
  } else if (policy.gatedAvailability === "ga") {
    /* tslint:disable-next-line: no-console */
    console.warn(
      `PERMISSION WARNING: gatedAvailability: "ga" is not a valid on "${policy.permission}" policy.`
    );
  }

  return checks;
}
