import { IItem } from "@esri/arcgis-rest-types";
import {
  IHubGeography,
  IHubRequestOptions,
  IPolygonProperties,
} from "../../../types";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { itemToSearchResult } from "../portalSearchItems";
import { IOgcItem } from "./interfaces";
import { geojsonToArcGIS } from "@terraformer/arcgis";

export async function ogcItemToSearchResult(
  ogcItem: IOgcItem,
  includes?: string[],
  requestOptions?: IHubRequestOptions
): Promise<IHubSearchResult> {
  // OGC Api stuffs the item wholesale in `.properties`
  // NOTE: the properties hash may also have some extraneous members such
  // as `license` and `source` if the OgcItem came from the index.
  const pseudoItem = ogcItem.properties as IItem;
  const result = await itemToSearchResult(pseudoItem, includes, requestOptions);
  // Expose extraneous members like `license`, `source`, and `geometry`
  result.source = ogcItem.properties.source;
  result.license = ogcItem.properties.license;
  // Add IHubGeography to result
  if (ogcItem.geometry) {
    try {
      // NOTE: Currently using IHubGeography, but should explore switching to IHubLocation
      result.geometry = {
        geometry: geojsonToArcGIS(ogcItem.geometry) as IPolygonProperties,
      };
    } catch {
      // If geojsonToArcGIS throws an error from an invalid input geometry,
      // just ignore for now
    }
  }

  return result;
}
