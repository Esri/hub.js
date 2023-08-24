import { IArcGISContext } from "../../ArcGISContext";
import { IPermissionPolicy, IPolicyCheck, IPolicyAssertion } from "../types";
import { checkAssertion } from "./checkAssertion";

/**
 * Validate entityOwner policy
 * @param policy
 * @param context
 * @param _entity
 * @returns
 */
export function checkAssertions(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  _entity?: Record<string, any>
): IPolicyCheck[] {
  let checks = [] as IPolicyCheck[];
  // Only return a check if the policy is defined
  if (policy.assertions) {
    // iterate over the assertions, creating a check for each entry
    checks = policy.assertions.map((assertion: IPolicyAssertion) => {
      return checkAssertion(assertion, _entity, context);
    });
  }

  return checks;
}
