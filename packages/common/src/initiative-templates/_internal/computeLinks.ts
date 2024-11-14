import { ArcGISIdentityManager, IRequestOptions } from "@esri/arcgis-rest-request";
import { IItem } from "@esri/arcgis-rest-portal";
import { getHubRelativeUrl } from "../../content/_internal/internalContentUtils";
import { getRelativeWorkspaceUrl, IHubEntityLinks } from "../../core";
import { getItemIdentifier } from "../../items";
import { getItemThumbnailUrl } from "../../resources";
import { getItemHomeUrl } from "../../urls";

/**
 * Compute the links that get appended to a Hub Initiative Template
 * search result and entity
 *
 * @param item
 * @param requestOptions
 * @returns
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
