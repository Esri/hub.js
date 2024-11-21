import { IItem } from "@esri/arcgis-rest-types";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubEntityLinks } from "../../core/types";
import { computeItemLinks } from "../../core/_internal/computeItemLinks";

/**
 * Compute the links that get appended to a Hub Site
 * search result and entity
 *
 * @param item
 * @param requestOptions
 */
export function computeLinks(
  item: IItem,
  requestOptions: IRequestOptions
): IHubEntityLinks {
  const links = computeItemLinks(item, requestOptions);
  return {
    ...links,
    // add the layout relative link
    layoutRelative: `/pages/${item.id}/edit`,
  };
}
