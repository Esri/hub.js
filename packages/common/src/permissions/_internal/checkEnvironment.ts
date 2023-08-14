import { IArcGISContext } from "../../ArcGISContext";
import { IPermissionPolicy } from "../types/IPermissionPolicy";
import { IPolicyCheck } from "../types/IPolicyCheck";
import { PolicyResponse } from "../types/PolicyResponse";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * @internal
 * Verify that the policy.environment requirement is met.
 *
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkEnvironment(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  _entity?: Record<string, any>
): IPolicyCheck[] {
  const checks = [] as IPolicyCheck[];
  if (policy.environments && policy.environments.length) {
    let result: PolicyResponse = "granted";

    if (!policy.environments.includes(context.environment)) {
      result = "not-in-environment";
    }
    const check: IPolicyCheck = {
      name: `user in ${policy.environments.join(",")} org`,
      value: context.environment,
      code: getPolicyResponseCode(result),
      response: result,
    };
    checks.push(check);
  }
  return checks;
}
