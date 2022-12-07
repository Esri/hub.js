import { IArcGISContext } from "../../ArcGISContext";
import { getProp } from "../../objects";
import { mapBy } from "../../utils";
import { IPolicyAssertion, IPolicyCheck, PolicyResponse } from "../types";
import { getPolicyResponseCode } from "./getPolicyResponseCode";

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
  // construct a hash to look up properties in
  const lookupHash = { entity, context };
  // get the property value
  const propertyLookup = parseProperty(assertion.property);
  const propValue = getProp(lookupHash, propertyLookup.path);

  // If prop is undefined, then the assertion fails
  if (propValue === undefined) {
    response = "assertion-property-not-found";
  }

  let val = assertion.value;
  if (typeof val === "string" && val.indexOf(":") > -1) {
    const valueLookup = parseProperty(assertion.value);
    val = getProp(lookupHash, valueLookup.path);
    if (val === undefined) {
      response = "assertion-property-not-found";
    }
  }

  // if we have the two values, we can make the assertion
  if (propValue !== undefined && val !== undefined) {
    // TODO: Should these fns return IPolicyCheck? or just the response?
    // TODO: Should these fns inspect the assertion internally? or switch case here?
    switch (assertion.assertion) {
      case "eq":
      case "neq":
        response = equalityAssertions(assertion, propValue, val);
        break;
      case "contains":
      case "without":
        response = arrayAssertions(assertion, propValue, val);
        break;
      case "included-in":
        response = includeAssertions(assertion, propValue, val);
        break;
      case "gt":
      case "lt":
        response = rangeAssertions(assertion, propValue, val);
        break;
      case "is-group-admin":
      case "is-group-member":
      case "is-group-owner":
        response = groupAssertions(assertion, propValue, val, context);
        break;
    }
  }

  const result: IPolicyCheck = {
    name: `assertion: ${assertion.property} ${assertion.assertion} ${assertion.value}`,
    value: propValue,
    code: getPolicyResponseCode(response),
    response,
  };

  return result;
}

function groupAssertions(
  assertion: IPolicyAssertion,
  propValue: any,
  val: any,
  context: IArcGISContext
): PolicyResponse {
  let response: PolicyResponse = "granted";
  const userGroups = context.currentUser.groups || [];

  // Default the groups to all groups the user is a member of
  let groups = mapBy("id", userGroups);
  let failResponse: PolicyResponse = "user-not-group-member";

  // if they are manage, filter to those groups
  if (assertion.assertion === "is-group-admin") {
    failResponse = "user-not-group-manager";
    groups = userGroups.reduce((acc, grp) => {
      if (grp.userMembership.memberType === "admin") {
        acc.push(grp.id);
      }
      // if they are an owner, they are also a manager
      if (grp.userMembership.memberType === "owner") {
        acc.push(grp.id);
      }
      return acc;
    }, []);
  }
  // if they are owner, filter to those groups
  if (assertion.assertion === "is-group-owner") {
    failResponse = "user-not-group-owner";
    groups = userGroups.reduce((acc, grp) => {
      if (grp.userMembership.memberType === "owner") {
        acc.push(grp.id);
      }
      return acc;
    }, []);
  }
  // now, see if the val is in the groups array
  if (!groups.includes(val)) {
    // send a specific response
    response = failResponse;
  }

  return response;
}

/**
 * Is the propValue included in the val array?
 * @param assertion
 * @param propValue
 * @param val
 * @returns
 */
function includeAssertions(
  assertion: IPolicyAssertion,
  propValue: any,
  val: any
): PolicyResponse {
  let response: PolicyResponse = "granted";
  if (!Array.isArray(val)) {
    response = "property-not-array";
  } else {
    const arrayVal = val as any[];
    if (!arrayVal.includes(propValue)) {
      response = "array-missing-required-value";
    }
  }
  return response;
}

/**
 * Is the propValue "eq" or "neq" to the val?
 * @param assertion
 * @param propValue
 * @param val
 * @returns
 */
function equalityAssertions(
  assertion: IPolicyAssertion,
  propValue: any,
  val: any
): PolicyResponse {
  let response: PolicyResponse = "granted";
  if (assertion.assertion === "eq" && propValue !== val) {
    response = "assertion-failed";
  } else if (assertion.assertion === "neq" && propValue === val) {
    response = "assertion-failed";
  }
  return response;
}

/**
 * Is the propValue "gt" or "lt" to the val?
 * @param assertion
 * @param propValue
 * @param val
 * @returns
 */
function rangeAssertions(
  assertion: IPolicyAssertion,
  propValue: any,
  val: any
): PolicyResponse {
  let response: PolicyResponse = "granted";

  if (typeof propValue !== "number" || typeof val !== "number") {
    response = "assertion-requires-numeric-values";
  }

  if (assertion.assertion === "gt" && propValue < val) {
    response = "assertion-failed";
  } else if (assertion.assertion === "lt" && propValue > val) {
    response = "assertion-failed";
  }
  return response;
}

/**
 * Does the propValue array "contain" or "without" the val?
 * @param assertion
 * @param propValue
 * @param val
 * @returns
 */
function arrayAssertions(
  assertion: IPolicyAssertion,
  propValue: any,
  val: any
): PolicyResponse {
  let response: PolicyResponse = "granted";
  if (!Array.isArray(propValue)) {
    response = "property-not-array";
  } else {
    const arrayProp = propValue as any[];
    const arrayContainsValue = arrayProp.includes(val);
    if (assertion.assertion === "contains" && !arrayContainsValue) {
      response = "array-missing-required-value";
    }
    if (assertion.assertion === "without" && arrayContainsValue) {
      response = "array-contains-invalid-value";
    }
  }
  return response;
}

function parseProperty(property: string): { root: string; path: string } {
  let root = "entity";
  let path = `entity.${property}`;
  if (property.indexOf(":") > -1) {
    root = property.split(":")[0];
    path = `${root}.${property.split(":")[1]}`;
  }
  return { root, path };
}
