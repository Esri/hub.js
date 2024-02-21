import { IArcGISContext } from "../../ArcGISContext";
import { HubAvailability, IPermissionPolicy } from "../types/IPermissionPolicy";
import { IPolicyCheck } from "../types/IPolicyCheck";
import { PolicyResponse } from "../types/PolicyResponse";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * @internal
 * Verify that the policy.availability requirement is met.
 * If a value is specified in the policy, the current context must be one of those values.
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkAvailability(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  _entity?: Record<string, any>
): IPolicyCheck[] {
  let checks = [] as IPolicyCheck[];
  if (policy.availability && policy.availability.length) {
    // Build array of the context's availability values
    // based on the isAlphaOrg and isBetaOrg properties
    const contextAvailability: HubAvailability[] = [];
    if (context.isAlphaOrg) {
      contextAvailability.push("alpha");
    }
    if (context.isBetaOrg) {
      contextAvailability.push("beta");
    }
    // if we have no values in the array, then we push in "ga"
    if (!contextAvailability.length) {
      contextAvailability.push("general");
    }

    // reduce over the policy.availability array, adding a check for each
    // value that is not included in the contextAvailability array
    // the 'flag' is only used when we want to gate the feature behind
    // a feature flag, e.g. ?pe=hub:card:follow
    checks = policy.availability.reduce((acc: IPolicyCheck[], value) => {
      let result: PolicyResponse = "granted";
      if (!contextAvailability.includes(value)) {
        if (value === "flag") {
          result = `feature-flag-required`;
        } else {
          result = `not-${value}-org` as PolicyResponse;
        }
      }
      let name = `user in ${value} org`;
      if (value === "flag") {
        name = `with feature flag`;
      }
      const check: IPolicyCheck = {
        name,
        value: contextAvailability.join(", "),
        code: getPolicyResponseCode(result),
        response: result,
      };
      acc.push(check);

      return acc;
    }, []);
  }
  return checks;
}
