import { computeItemLinks } from "../../core/_internal/computeItemLinks";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import type { IItem } from "../../rest/types";
import { IHubEntityLinks } from "../../core";

/**
 * Compute the links that get appended to a Hub Project
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
