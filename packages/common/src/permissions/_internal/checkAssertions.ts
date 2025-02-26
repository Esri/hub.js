import type { IArcGISContext } from "../../IArcGISContext";
import { IPermissionPolicy, IPolicyCheck, IPolicyAssertion } from "../types";
import { checkAssertion } from "./checkAssertion";

/**
 * Validate entityOwner policy
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkAssertions(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: Record<string, any>
): IPolicyCheck[] {
  let checks = [] as IPolicyCheck[];
  // Only return a check if the policy is defined
  if (policy.assertions) {
    // iterate over the assertions, creating a check for each entry
    checks = policy.assertions.reduce(
      (acc: IPolicyCheck[], assertion: IPolicyAssertion) => {
        let shouldCheckAssertion = true;

        // if conditions, check them first
        if (assertion.conditions?.length) {
          shouldCheckAssertion = assertion.conditions.every(
            (condition: IPolicyAssertion) =>
              checkAssertion(condition, entity, context).response === "granted"
          );
        }

        // if we pass all conditions/there are no conditions, we evaluate the assertion
        // otherwise, the assertion is ignored
        if (shouldCheckAssertion) {
          const chk = checkAssertion(assertion, entity, context);
          acc = [...acc, chk];
        }

        return acc;
      },
      []
    );
  }

  return checks;
}
