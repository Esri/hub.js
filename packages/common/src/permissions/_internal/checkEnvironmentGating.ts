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
export function checkEnvironmentGating(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  _entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];
  if (policy.gatedEnvironment) {
    let result: PolicyResponse = "granted";

    if (policy.gatedEnvironment !== context.environment) {
      if (policy.gatedEnvironment === "qaext") {
        result = "not-qaext-org";
      }
      if (policy.gatedEnvironment === "devext") {
        result = "not-devext-org";
      }
    }

    const check: IPolicyCheck = {
      name: `user in ${policy.gatedEnvironment} org`,
      value: context.hubLicense,
      code: getPolicyResponseCode(result),
      response: result,
    };

    checks.push(check);
  }
  return checks;
}
