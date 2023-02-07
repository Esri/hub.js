import { IItem } from "@esri/arcgis-rest-types";
import { IHubRequestOptions } from "../../../types";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { itemToSearchResult } from "../portalSearchItems";
import { IOgcItem } from "./interfaces";

/**
 * Converts an OGC Item into an IHubSearchResult
 *
 * @param ogcItem ogcItem to be transformed
 * @param includes additional fields to fetch on an item-by-item basis
 * @param requestOptions request options for fetching any additional includes
 * @returns the converted result
 */
export function ogcItemToSearchResult(
  ogcItem: IOgcItem,
  includes?: string[],
  requestOptions?: IHubRequestOptions
): Promise<IHubSearchResult> {
  // OGC Api stuffs the item wholesale in  `.properties`
  // NOTE: the properties hash may also have some extraneous members such
  // as `license` and `source` if the OgcItem came from the index.
  const pseudoItem = ogcItem.properties as IItem;
  return itemToSearchResult(pseudoItem, includes, requestOptions);
}
