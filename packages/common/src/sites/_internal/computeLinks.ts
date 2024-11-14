import { IItem } from "@esri/arcgis-rest-portal";
import { ArcGISIdentityManager, IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubEntityLinks } from "../../core/types";
import { getItemIdentifier } from "../../items";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { getItemThumbnailUrl } from "../../resources/get-item-thumbnail-url";
import { getHubRelativeUrl } from "../../content/_internal/internalContentUtils";

/**
 * Compute the links that get appended to a Hub Site
 * search result and entity
 *
 * @param item
 * @param requestOptions
 */
export function computeLinks (
  item: IItem,
  requestOptions: IRequestOptions
): IHubEntityLinks {
  let token: string;
  if (requestOptions.authentication) {
    const session: ArcGISIdentityManager = requestOptions.authentication as ArcGISIdentityManager;
    token = session.token;
  }

  return {
    self: item.url,
    siteRelative: getHubRelativeUrl(item.type, item.id, item.typeKeywords),
    siteRelativeEntityType: getHubRelativeUrl(item.type),
    layoutRelative: "/edit",
    workspaceRelative: getRelativeWorkspaceUrl(
      item.type,
      getItemIdentifier(item)
    ),
    thumbnail: getItemThumbnailUrl(item, requestOptions, token),
  };
}
