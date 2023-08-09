import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  GenericResult,
  IMatchReason,
  IPredicateExplanation,
} from "../explainQueryResult";
import { cloneObject } from "../../util";
import { IMatchOptions } from "../types";
import { IGroup, getItemGroups } from "@esri/arcgis-rest-portal";
import { getWithDefault } from "../../objects/get-with-default";
import { getProp } from "../../objects/get-prop";

export async function explainDatePredicate(
  predicate: Record<string, IMatchOptions>,
  result: GenericResult,
  requestOptions: IRequestOptions
): Promise<IPredicateExplanation> {
  // get the value from the predicate
  throw new Error("Not implemented");
}

export async function explainPropPredicate(
  predicate: Record<string, IMatchOptions>,
  result: GenericResult,
  requestOptions: IRequestOptions
): Promise<IPredicateExplanation> {
  // get the value from the predicate
  throw new Error("Not implemented");
}

/**
 * @internal
 * Create explanation for an IMatchOptions predicate
 * @param predicate
 * @param result
 * @param requestOptions
 * @returns
 */
export async function explainMatchOptionPredicate(
  predicate: Record<string, IMatchOptions>,
  result: GenericResult,
  requestOptions: IRequestOptions
): Promise<IPredicateExplanation> {
  // get the key from the predicate
  const attribute = Object.keys(predicate)[0];
  const matchOptions = predicate[attribute];

  const explanation: IPredicateExplanation = {
    predicate: cloneObject(predicate),
    matched: true,
    reasons: [],
  };

  // Construct meta hash that will allow us to carry additional info about the match
  const meta = {} as Record<string, any>;

  // TODO Implement when needed
  // if (attribute === "orgid") {
  //   // fetch org into and attach the id + name into the meta hash
  // }

  if (attribute === "group") {
    // fetch items groups and attach as `group` prop
    const response = await getItemGroups(result.id, requestOptions);
    // ----------------------------------------
    // TODO: We've got a bunch of useful group info in the response, but only use the ids for the explanation
    // However, to provide the user a useful explanation, we should include the group titles, and maybe even the group owners
    // ----------------------------------------
    // map out the id and titles into meta.groups

    meta.groups = [
      ...getWithDefault(response, "admin", []),
      ...getWithDefault(response, "member", []),
      ...getWithDefault(response, "other", []),
    ].map((g: IGroup) => ({ id: g.id, title: g.title }));
    // and the id's into the match options attribute `group`
    result.group = meta.groups.map((g: IGroup) => g.id);
  }
  // get the value of the key, from the result
  const resultValue = getProp(result, attribute);
  if (resultValue) {
    // check the any, all, not, exact props if defined
    const fns = {
      any: checkAny,
      all: checkAll,
      not: checkNot,
    };
    // for each prop, if defined, call the appropriate check function
    Object.keys(fns).forEach((prop) => {
      const conditionToCheck = getProp(matchOptions, prop);
      if (conditionToCheck) {
        const fn = getProp(fns, prop);
        const r = fn(attribute, conditionToCheck, resultValue);
        r.meta = meta;
        explanation.reasons.push(r);
      }
    });
    // decide if all the predicates matched
    explanation.matched = explanation.reasons.every((r) => r.matched);
  } else {
    explanation.matched = false;
    explanation.reasons.push({
      attribute,
      matched: false,
      message: `Property ${attribute} not present on search result, cannot provide explanation`,
    });
  }
  return Promise.resolve(explanation);
}

/**
 * Returns information about the match between a result value and the .any property of an IMatchOptions predicate
 * @param attribute
 * @param option
 * @param resultValue
 * @returns
 */
export function checkAny(
  attribute: string,
  option: string | string[],
  resultValue: string | string[]
): IMatchReason {
  const result: IMatchReason = {
    attribute,
    values: arrayify(resultValue).join(","),
    condition: "IN",
    matched: false,
    requirement: arrayify(option).join(","),
    message: "No match",
  };

  const { options, matches } = getMatches(
    arrayify(option),
    arrayify(resultValue)
  );

  result.matched = matches.length > 0;

  if (result.matched) {
    result.message = `Value(s) ${result.values} contained at least one of value from [${result.requirement}]`;
  } else {
    result.message = `Value(s) ${result.values} did not contain any of value from [${result.requirement}]`;
  }

  return result;
}
/**
 * * Returns information about the match between a result value and the .all property of an IMatchOptions predicate
 * @param attribute
 * @param option
 * @param resultValue
 * @returns
 */
export function checkAll(
  attribute: string,
  option: string | string[],
  resultValue: string | string[]
): IMatchReason {
  const result: IMatchReason = {
    attribute,
    values: arrayify(resultValue).join(","),
    condition: "ALL",
    requirement: arrayify(option).join(","),
    matched: false,
    message: "No match",
  };

  const { options, matches } = getMatches(
    arrayify(option),
    arrayify(resultValue)
  );

  result.matched = matches.length === options.length;

  if (result.matched) {
    result.message = `Value(s) ${result.values} contained all values from [${result.requirement}]`;
  } else {
    result.message = `Value(s) ${result.values} did not contain all values from [${result.requirement}]`;
  }

  return result;
}

/**
 * * Returns information about the match between a result value and the .not property of an IMatchOptions predicate
 * @param attribute
 * @param option
 * @param resultValue
 * @returns
 */
export function checkNot(
  attribute: string,
  option: string | string[],
  resultValue: string | string[]
): IMatchReason {
  const result: IMatchReason = {
    attribute,
    values: arrayify(resultValue).join(","),
    condition: "NOT_IN",
    requirement: arrayify(option).join(","),
    matched: false,
    message: "No match",
  };

  const { options, values, matches } = getMatches(
    arrayify(option),
    arrayify(resultValue)
  );

  result.matched = matches.length === 0;

  if (result.matched) {
    result.message = `Value(s) ${result.values} is not contained in [${result.requirement}]`;
  } else {
    result.message = `Value(s) ${result.values} is contained in [${result.requirement}]`;
  }

  return result;
}

/**
 * Ensure a value that could be `string | string[]` is a `string[]`
 * @param value
 * @returns
 */
function arrayify(value: string | string[]): string[] {
  if (!Array.isArray(value)) {
    return [value];
  }
  return value;
}

/**
 * Return matching values from two arrays
 * @param options
 * @param resultValues
 * @returns
 */
function getMatches(
  options: string[],
  resultValues: string[]
): { options: string[]; values: string[]; matches: string[] } {
  const result = {
    options,
    values: resultValues,
    matches: [] as string[],
  };
  result.matches = options.reduce((acc, o) => {
    if (resultValues.includes(o)) {
      acc.push(o);
    }
    return acc;
  }, []);
  return result;
}
