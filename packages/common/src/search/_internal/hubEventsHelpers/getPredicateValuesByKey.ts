import { IFilter } from "../../types/IHubCatalog";

export const getPredicateValuesByKey = (
  filters: IFilter[],
  predicateKey: string
): any[] => {
  const toPredicateValuesByKey = (a1: any[], filter: IFilter): any[] =>
    filter.predicates.reduce<any[]>(
      (a2, predicate) =>
        Object.entries(predicate).reduce(
          (a3, [key, val]) => (key === predicateKey ? [...a3, val] : a3),
          a2
        ),
      a1
    );
  return filters.reduce(toPredicateValuesByKey, []);
};
