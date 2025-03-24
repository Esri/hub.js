import type { IItem } from "@esri/arcgis-rest-types";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubEntityLinks } from "../../core/types";
import { computeItemLinks } from "../../core/_internal/computeItemLinks";
import { getHubRelativeUrl } from "../../content/_internal/internalContentUtils";
import { getItemIdentifier } from "../../items/getItemIdentifier";

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
  // re-compute the site relative link to include the id
  // NOTE: when we expand this beyond pages we should drop this override
  // and just pass true to getItemIdentifier in computeItemLinks
  const siteRelative = getHubRelativeUrl(
    item.type,
    getItemIdentifier(item, true),
    item.typeKeywords
  );
  return {
    ...links,
    // add id to site relative link
    siteRelative,
    // add the layout relative link
    layoutRelative: `/pages/${item.id}/edit`,
  };
}
