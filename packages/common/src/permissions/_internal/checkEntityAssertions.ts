import { IArcGISContext } from "../../ArcGISContext";
import { getProp } from "../../objects";
import {
  IPermissionPolicy,
  PolicyResponse,
  IPolicyCheck,
  IPolicyAssertion,
} from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

/**
 * Validate entityOwner policy
 * @param policy
 * @param context
 * @param entity
 * @returns
 */
export function checkEntityAssertions(
  policy: IPermissionPolicy,
  context: IArcGISContext,
  entity?: Record<string, any>
): IPolicyCheck[] {
  let checks = [] as IPolicyCheck[];
  // Only return a check if the policy is defined
  if (policy.assertions) {
    if (!entity) {
      // fail, entity required
    } else {
      // iterate over the assertions, creating a check for each entry
      checks = policy.assertions.map((assertion: IPolicyAssertion) => {
        return checkAssertion(assertion, entity, context);
      });
    }
  }

  return checks;
}

/**
 * Check a specific EntityAssertion
 * Exported purely for testing. Not exported from the package.
 * @param assertion
 * @param entity
 * @param context
 * @returns
 */
export function checkAssertion(
  assertion: IPolicyAssertion,
  entity: Record<string, any>,
  context: IArcGISContext
): IPolicyCheck {
  let response: PolicyResponse = "granted";

  const prop = getProp(entity, assertion.property);
  // If prop is undefined, then the assertion fails
  if (prop === undefined) {
    response = "entity-property-not-found";
  }

  // get the value - static or looked up in the entity or context
  let val = assertion.value;
  if (assertion.valueType === "entity-lookup") {
    val = getProp(entity, assertion.value);
    if (val === undefined) {
      response = "entity-lookup-property-not-found";
    }
  }
  if (assertion.valueType === "context-lookup") {
    val = getProp(context, assertion.value);
    if (val === undefined) {
      response = "context-lookup-property-not-found";
    }
  }

  // if result is not already rejected, we can make the assertion
  if (prop !== undefined && val !== undefined) {
    // Array checks
    if (
      assertion.assertion === "contains" ||
      assertion.assertion === "not-contains"
    ) {
      // if it's not an array, then the assertion fails
      if (!Array.isArray(prop)) {
        response = "property-not-array";
      } else {
        const arrayProp = prop as Array<any>;
        const arrayContainsValue = arrayProp.includes(val);
        if (assertion.assertion === "contains" && !arrayContainsValue) {
          response = "array-missing-required-value";
        }
        if (assertion.assertion === "not-contains" && arrayContainsValue) {
          response = "array-contains-invalid-value";
        }
      }
    } else {
      const propMatches = prop === val;

      if (assertion.assertion === "eq" && !propMatches) {
        response = "property-mismatch";
      } else if (assertion.assertion === "neq" && propMatches) {
        response = "property-mismatch";
      }
    }
  }

  let result: IPolicyCheck = {
    name: `entity assertion: ${assertion.property} ${assertion.assertion} ${assertion.value}`,
    value: prop,
    code: getPolicyResponseCode(response),
    response,
  };

  return result;
}
