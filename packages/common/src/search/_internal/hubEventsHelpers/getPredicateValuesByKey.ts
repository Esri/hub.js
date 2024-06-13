import { IFilter } from "../../types/IHubCatalog";

export const getPredicateValuesByKey = <T>(
  filters: IFilter[],
  predicateKey: string
): T[] => {
  const toPredicateValuesByKey = (a1: T[], filter: IFilter): T[] =>
    filter.predicates.reduce<T[]>(
      (a2, predicate) =>
        Object.entries(predicate).reduce(
          (a3, [key, val]) =>
            key === predicateKey
              ? [...a3, ...(Array.isArray(val) ? val : [val])]
              : a3,
          a2
        ),
      a1
    );
  return filters.reduce<T[]>(toPredicateValuesByKey, []);
};
