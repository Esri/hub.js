import { IQuery } from "./types/IHubCatalog";
import { getWithDefault } from "../objects/get-with-default";
import { unique } from "../util";
import { expandPredicates } from "./_internal/portalSearchItems";

/**
 * Get all the values for a predicate in a query
 * @param predicateProp The predicate property to get the values for
 * @param query The query to get the values from
 * @returns An array of all the values for the predicate
 */

export function getPredicateValues(
  predicateProp: string,
  query: IQuery,
  props: string[] = ["any", "all"]
): string[] {
  // ensure the query is expanded (meaning that the predicates are IMatchOptions)
  const expanded = expandPredicates(query);

  return (
    // iterate over the filters
    expanded.filters
      // get all the predicates from all the filters and flatten...
      .reduce((acc, filter) => [...acc, ...filter.predicates], [])
      // get the `.any` and `.all` values for the prop
      .reduce((acc, predicate) => {
        // iterate the props and add them to the accumulator
        props.forEach((prop) => {
          acc = [
            ...acc,
            ...getWithDefault(predicate, `${predicateProp}.${prop}`, []),
          ];
        });

        return acc;
      }, [])
      // drop dupes
      .filter(unique)
  );
}
