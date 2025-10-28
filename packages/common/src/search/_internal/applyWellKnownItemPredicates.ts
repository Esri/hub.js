import { HubFamily } from "../../hub-types";
import { cloneObject } from "../../util";
import { getFamilyTypes } from "../../content/get-family";
import { IQuery, IPredicate } from "../types/IHubCatalog";
import { WellKnownItemPredicates } from "./constants";
import { isWellKnownTypeFilter } from "./isWellKnownTypeFilter";
import { isFamilyExpansionType } from "./isFamilyExpansionType";

/**
 * Return the predicates for a well-known type
 * @param key
 * @returns
 */
function lookupTypePredicates(
  key: keyof typeof WellKnownItemPredicates
): IPredicate[] {
  return WellKnownItemPredicates[key];
}

/**
 * @private
 * Convert a Filter Group to expand well-known type filters
 *
 * The purpose of this function is to allow for the use of short-hand
 * names for commonly used, complex queries.
 *
 * It works by looking for filters using the .type property, the value
 * of which is a key in the WellKnownItemFilters hash. If found in the
 * hash, the filters array of the active filterGroup is replaced with the
 * filters specified in the hash.
 *
 * NOTE: Any other properties specified in a filter will be removed
 *
 * Only exported to enable extensive testing
 * @param query
 */
export function applyWellKnownItemPredicates(query: IQuery): IQuery {
  const queryClone = cloneObject(query);
  // iterate the filters
  queryClone.filters = queryClone.filters.map((filter) => {
    // replace predicates with well-known types
    let replacedPredicates = false;
    filter.predicates = filter.predicates.reduce(
      (acc: IPredicate[], predicate) => {
        // if the predicate has a well-known type
        // we replace it with the set of predicates defined
        // for the well-known type
        if (isWellKnownTypeFilter(predicate.type)) {
          const replacements = lookupTypePredicates(
            predicate.type as keyof typeof WellKnownItemPredicates
          );
          acc = [...acc, ...replacements];
          replacedPredicates = true;
        } else if (
          /**
           * NOTE: as of Nov. 26 2024, we have elected to start using the family types
           * for a type replacement rather than the entire replacement itself. This updates
           * a well-known predicate to only have type values, rather than types, typekeywords, etc etc.
           * We also use the family types to replace the type values. Almost all of our current type
           * replacements include typekeywords only to also retrieve old items -- i.e. having  -- we need to be aware
           * that by using family types, we are not including these old items in results in these cases.
           *
           * This clause is primarily used by custom-build catalogs using the new catalog editor.
           *
           * We specifically do not say that we have replaced filters here either as we want to leave the
           * operator as is.
           */
          predicate.type &&
          typeof predicate.type !== "string" &&
          !Array.isArray(predicate.type)
        ) {
          // we have an IMatchOptions object, so we have to iterate over the all/any/not
          Object.keys(predicate.type).forEach((key) => {
            const types = predicate.type[key];

            // try to reduce the array if it is an array
            /* istanbul ignore else -- @preserve */
            if (Array.isArray(types)) {
              // for each type, try to replace it with the family types if it is an expansion
              predicate.type[key] = types.reduce(
                (typesAcc: string[], type: string) => {
                  if (isFamilyExpansionType(type)) {
                    // we need the type keyword without the dollar sign
                    const family = type.slice(1);
                    // get the family types from the given expansion
                    const familyTypes = getFamilyTypes(family as HubFamily);
                    typesAcc = [...typesAcc, ...familyTypes];
                  } else {
                    typesAcc.push(type);
                  }
                  return typesAcc;
                },
                []
              );
            }
          });

          // keep the updated predicate
          acc.push(predicate);
        } else {
          // this predicate does not have a well-known type
          // so we just keep it
          acc.push(predicate);
        }
        return acc;
      },
      []
    );
    if (replacedPredicates) {
      // Any filter who's predicates were replaced with
      // well-known predicates, needs to use "OR" to ensure
      // correct query logic
      filter.operation = "OR";
    }
    return filter;
  });

  return queryClone;
}
