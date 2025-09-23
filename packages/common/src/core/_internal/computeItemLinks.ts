import type { IItem } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { getItemThumbnailUrl } from "../../resources/get-item-thumbnail-url";
import { getHubRelativeUrl } from "../../content/_internal/internalContentUtils";
import { getItemIdentifier } from "../../items/getItemIdentifier";
import { getItemHomeUrl } from "../../urls/get-item-home-url";
import { IHubEntityLinks } from "../types/IHubEntityBase";

/**
 * Compute the links that get appended to a Hub Initiative
 * search result and entity
 *
 * @param item
 * @param requestOptions
 */
export function computeItemLinks(
  item: IItem,
  requestOptions: IRequestOptions
): IHubEntityLinks {
  let token: string;
  if (requestOptions.authentication) {
    const session: ArcGISIdentityManager =
      requestOptions.authentication as ArcGISIdentityManager;
    token = session.token;
  }

  return {
    self: getItemHomeUrl(item.id, requestOptions),
    siteRelative: getHubRelativeUrl(
      item.type,
      // use slug if available, otherwise id
      getItemIdentifier(item),
      item.typeKeywords
    ),
    siteRelativeEntityType: getHubRelativeUrl(item.type),
    // no SEO for workspace, so we always use id instead of slug
    workspaceRelative: getRelativeWorkspaceUrl(item.type, item.id),
    thumbnail: getItemThumbnailUrl(item, requestOptions, token),
  };
}
