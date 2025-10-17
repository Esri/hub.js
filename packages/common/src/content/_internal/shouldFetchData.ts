import { IItem } from "@esri/arcgis-rest-portal";
import { normalizeItemType } from "../compose";
import { getFamily } from "../get-family";
import { includes } from "../../utils/includes";

// TODO: need to fetch data for client-side layer views as well
// determine if we should fetch data for an item
/**
 * Determine if we should fetch data(.json or other content) for an item
 * @param item
 * @returns
 */
export const shouldFetchData = (item: IItem): boolean => {
  const type = normalizeItemType(item);
  const family = getFamily(type);
  const dataFamilies = ["template", "solution"];
  const dataTypes = [
    // needed for web map/scene definition
    "Web Map",
    "Web Scene",
    // needed for popup template definition
    "Feature Service",
    // other types that require data fetches
    "Discussion",
    "Hub Initiative",
    "Hub Page",
    "Hub Project",
  ];
  return includes(dataFamilies, family) || includes(dataTypes, type);
};
