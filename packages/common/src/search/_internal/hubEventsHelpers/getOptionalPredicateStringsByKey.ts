import { unique } from "../../../util";
import { IFilter } from "../../types/IHubCatalog";
import { getPredicateValuesByKey } from "./getPredicateValuesByKey";

export const getOptionalPredicateStringsByKey = (
  filters: IFilter[],
  predicateKey: string
): string => {
  const predicateValues = getPredicateValuesByKey<string>(
    filters,
    predicateKey
  );
  const str = predicateValues.filter(unique).join(",");
  if (str) {
    return str;
  }
};
