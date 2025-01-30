import { unique } from "../../../util";
import { IFilter } from "../../types/IHubCatalog";
import { getPredicateValuesByKey } from "./getPredicateValuesByKey";

export const getUniquePredicateValuesByKey = <T>(
  filters: IFilter[],
  predicateKey: string
): T[] => {
  return getPredicateValuesByKey<T>(filters, predicateKey).filter(unique);
};
