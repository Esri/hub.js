import { IItem } from "@esri/arcgis-rest-types";
import { IHubRequestOptions } from "../../../types";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { itemToSearchResult } from "../portalSearchItems";
import { IOgcItem } from "./interfaces";

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
