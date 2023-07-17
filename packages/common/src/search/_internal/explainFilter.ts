import { IRequestOptions } from "@esri/arcgis-rest-request";
import { GenericResult, IFilterExplanation } from "../explainResult";
import { IFilter } from "../types/IHubCatalog";
import { cloneObject } from "../../util";
import { explainPredicate } from "./explainPredicate";

/**
 * Generate an explanation if a specific result passes the filter's criteria
 * @param filter
 * @param result
 * @param requestOptions
 * @returns
 */

export async function explainFilter(
  filter: IFilter,
  result: GenericResult,
  requestOptions: IRequestOptions
): Promise<IFilterExplanation> {
  // setup return value
  const explanation: IFilterExplanation = {
    filter: cloneObject(filter),
    matched: false,
    reasons: [],
  };
  // for each predicate, explain the match and return the explanation
  for (const predicate of filter.predicates) {
    const r = await explainPredicate(predicate, result, requestOptions);
    explanation.reasons.push(r);
  }
  // depending on the operation, we combine the predicate results differently
  if (filter.operation === "OR") {
    // if any of the predicates match, then the filter matches
    explanation.matched = explanation.reasons.some((r) => r.matched);
  } else {
    // filter.operation defaults to AND
    explanation.matched = explanation.reasons.every((r) => r.matched);
  }

  // return
  return explanation;
}
