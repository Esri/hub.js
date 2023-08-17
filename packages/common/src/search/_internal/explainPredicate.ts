import { IRequestOptions } from "@esri/arcgis-rest-request";
import { GenericResult, IPredicateExplanation } from "../explainQueryResult";
import { cloneObject } from "../../util";
import { IMatchOptions } from "../types";
import {
  PREDICATE_DATE_PROPS,
  PREDICATE_NON_MATCH_OPTIONS_PROPS,
} from "./expandPredicate";
import {
  explainMatchOptionPredicate,
  explainDatePredicate,
  explainPropPredicate,
} from "./explainHelpers";

/**
 * Geneate an explanation if a specific result passes the predicate's criteria
 * This will delegate to more specific functions based on the predicate's key
 * @param predicate
 * @param result
 * @param requestOptions
 * @returns
 */

export async function explainPredicate(
  predicate: Record<string, IMatchOptions>,
  result: GenericResult,
  requestOptions: IRequestOptions
): Promise<IPredicateExplanation> {
  // const predicateResult: IPredicateExplanation = {
  //   predicate: cloneObject(predicate),
  //   included: false,
  //   reasons: [],
  // };

  // get the key from the predicate
  const key = Object.keys(predicate)[0];
  // default to match options...
  let fn = explainMatchOptionPredicate;

  // However, some keys are treated differently
  if (PREDICATE_NON_MATCH_OPTIONS_PROPS.includes(key)) {
    if (PREDICATE_DATE_PROPS.includes(key)) {
      // handle as date
      fn = explainDatePredicate;
    } else {
      // handle as prop we just copy forward
      fn = explainPropPredicate;
    }
  }
  // return the result
  return fn(predicate, result, requestOptions);
}
