import { IItem } from "@esri/arcgis-rest-portal";
import { ArcGISIdentityManager, IRequestOptions } from "@esri/arcgis-rest-request";
import { getItemHomeUrl } from "../../urls";
import { IHubEntityLinks } from "../../core/types";
import { getItemIdentifier } from "../../items";
import { getHubRelativeUrl } from "../../content/_internal/internalContentUtils";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { getItemThumbnailUrl } from "../../resources/get-item-thumbnail-url";

/**
 * Compute the links that get appended to a Hub Project
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
    self: getItemHomeUrl(item.id, requestOptions),
    siteRelative: getHubRelativeUrl(item.type, getItemIdentifier(item)),
    siteRelativeEntityType: getHubRelativeUrl(item.type),
    workspaceRelative: getRelativeWorkspaceUrl(
      item.type,
      getItemIdentifier(item)
    ),
    thumbnail: getItemThumbnailUrl(item, requestOptions, token),
  };
}
