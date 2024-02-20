import { IGroup } from "@esri/arcgis-rest-portal";
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
    // TODO: Should these fns inspect the type internally? or switch case here?
    switch (assertion.type) {
      case "eq":
      case "neq":
        response = equalityAssertions(assertion, propValue, val);
        break;
      case "starts-with":
      case "ends-with":
      case "not-starts-with":
      case "not-ends-with":
        response = stringAssertions(assertion, propValue, val);
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
      case "length-gt":
      case "length-lt":
        response = lengthAssertions(assertion, propValue, val);
        break;
      case "is-group-admin":
      case "is-group-member":
      case "is-group-owner":
        response = groupAssertions(assertion, propValue, val, context);
        break;
    }
  }

  const result: IPolicyCheck = {
    name: `assertion: ${assertion.property} ${assertion.type} ${assertion.value}`,
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

  if (assertion.type === "is-group-member") {
    failResponse = "user-not-group-member";
    // no need to filter - this is anyone who's a member
    groups = filterByMembershipType(userGroups, ["admin", "owner", "member"]);
  }

  if (assertion.type === "is-group-admin") {
    failResponse = "user-not-group-manager";
    groups = filterByMembershipType(userGroups, ["admin", "owner"]);
  }

  if (assertion.type === "is-group-owner") {
    failResponse = "user-not-group-owner";
    groups = filterByMembershipType(userGroups, ["owner"]);
  }

  // now, see if the val is in the groups array
  if (!groups.includes(val)) {
    // send a specific response
    response = failResponse;
  }

  return response;
}

function filterByMembershipType(groups: IGroup[], types: string[]): IGroup[] {
  return groups.reduce((acc, grp) => {
    if (types.includes(grp.userMembership.memberType)) {
      acc.push(grp.id);
    }
    return acc;
  }, []);
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
  if (assertion.type === "eq" && propValue !== val) {
    response = "assertion-failed";
  } else if (assertion.type === "neq" && propValue === val) {
    response = "assertion-failed";
  }
  return response;
}

/**
 * Does the propValue "starts-with" or "ends-with" the val?
 * @param assertion
 * @param propValue
 * @param val
 * @returns
 */
function stringAssertions(
  assertion: IPolicyAssertion,
  propValue: any, // what we found
  val: any // what we're looking for
): PolicyResponse {
  let response: PolicyResponse = "granted";
  if (assertion.type === "starts-with" && !propValue.startsWith(val)) {
    response = "assertion-failed";
  } else if (
    assertion.type === "not-starts-with" &&
    propValue.startsWith(val)
  ) {
    response = "assertion-failed";
  } else if (assertion.type === "ends-with" && !propValue.endsWith(val)) {
    response = "assertion-failed";
  } else if (assertion.type === "not-ends-with" && propValue.endsWith(val)) {
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

  if (assertion.type === "gt" && !(propValue > val)) {
    response = "assertion-failed";
  } else if (assertion.type === "lt" && !(propValue < val)) {
    response = "assertion-failed";
  }
  return response;
}

/**
 * Is the propValue length "gt" or "lt" to the val?
 * @param assertion
 * @param propValue
 * @param val
 * @returns
 */
function lengthAssertions(
  assertion: IPolicyAssertion,
  propValue: any,
  val: any
): PolicyResponse {
  let response: PolicyResponse = "granted";
  if (typeof propValue !== "string" && !Array.isArray(propValue)) {
    response = "property-has-no-length";
  } else if (typeof val !== "number") {
    response = "assertion-requires-numeric-values";
  } else {
    if (assertion.type === "length-gt" && !(propValue.length > val)) {
      response = "assertion-failed";
    } else if (assertion.type === "length-lt" && !(propValue.length < val)) {
      response = "assertion-failed";
    }
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
    if (assertion.type === "contains" && !arrayContainsValue) {
      response = "array-missing-required-value";
    }
    if (assertion.type === "without" && arrayContainsValue) {
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
