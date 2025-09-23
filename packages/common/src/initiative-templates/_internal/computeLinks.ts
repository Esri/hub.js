import { IRequestOptions } from "@esri/arcgis-rest-request";
import type { IItem } from "@esri/arcgis-rest-portal";
import { computeItemLinks } from "../../core/_internal/computeItemLinks";
import { IHubEntityLinks } from "../../core/types/IHubEntityBase";

/**
 * Compute the links that get appended to a Hub Initiative Template
 * search result and entity
 *
 * @param item
 * @param requestOptions
 * @returns
 */
export function computeLinks(
  item: IItem,
  requestOptions: IRequestOptions
): IHubEntityLinks {
  return computeItemLinks(item, requestOptions);
}
