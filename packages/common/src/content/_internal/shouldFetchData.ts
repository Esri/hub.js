import { IItem } from "@esri/arcgis-rest-portal";
import { normalizeItemType } from "../compose";
import { getFamily } from "../get-family";
import { includes } from "../../utils/includes";

// TODO: need to fetch data for client-side layer views as well
// determine if we should fetch data for an item
/**
 * Determine if we should fetch data(.json or other content) for an item
 * @param item
 * @param allowTypes *to be used sparingly* -- additional types that should trigger a data fetch
 * @param allowFamilies *to be used sparingly* -- additional families that should trigger a data fetch
 * @returns
 */
export const shouldFetchData = (
  item: IItem,
  allowTypes: string[] = [],
  allowFamilies: string[] = []
): boolean => {
  const type = normalizeItemType(item);
  const family = getFamily(type);
  const dataFamilies = ["template", "solution", ...allowFamilies];
  const dataTypes = [
    // needed for web map/scene definition
    "Web Map",
    "Web Scene",
    // needed for popup template definition
    "Feature Service",
    ...allowTypes,
  ];
  return includes(dataFamilies, family) || includes(dataTypes, type);
};
