import { IQuery } from "../../types/IHubCatalog";
import { getTopLevelPredicate } from "../commonHelpers/getTopLevelPredicate";

// TODO: the 'q' query param logic is only here because the
// OGC API currently has a bug where 'q' cannot be included
// in the 'filter' string. Once that bug is resolved, rip this
// logic out and let predicates with 'term' to be processed normally

export function getQQueryParam(query: IQuery) {
  const qPredicate = getTopLevelPredicate("term", query.filters);
  return qPredicate?.term;
}
