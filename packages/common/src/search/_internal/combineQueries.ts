import { IQuery } from "../types/IHubCatalog";

/**
 * @internal
 * Naieve implementation to merge two queries into one. This
 * simply combines the filters of the two queries. It does not attempt
 * to disabiguate the filters or predicates. It is up to the caller
 * to ensure that the queries are compatible and don't result in a null set
 * of results.
 * @param queries
 * @returns
 */

export const combineQueries = (queries: IQuery[]): IQuery => {
  // remove any entries that are null or undefined
  queries = queries.filter((e) => e);
  // check tht all queries are for the same entity type
  const targetEntity = queries[0].targetEntity;
  if (queries.some((q) => q.targetEntity !== targetEntity)) {
    throw new Error("Cannot combine queries for different entity types");
  }

  // combine the filters from all the queries
  const filters = queries.reduce((acc, q) => [...acc, ...q.filters], []);

  const result: IQuery = {
    targetEntity,
    filters,
  };
  return result;
};
