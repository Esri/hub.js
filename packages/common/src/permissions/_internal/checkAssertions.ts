import { IArcGISContext } from "../../ArcGISContext";
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
        let conditionResult = true;

        // if the assertion has conditions, we need to check them first
        // to determine if the assertion itself needs to be checked in the first place.
        if (assertion.conditions?.length) {
          conditionResult = assertion.conditions.every(
            (condition: IPolicyAssertion) =>
              checkAssertion(condition, entity, context).response === "granted"
          );
        }

        // if we pass the conditions, we should check the assertion
        // otherwise, this assertion is irrelevant and we should skip it
        if (conditionResult) {
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
