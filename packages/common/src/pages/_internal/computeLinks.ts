import { IItem } from "@esri/arcgis-rest-types";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IHubEntityLinks } from "../../core/types";
import { getItemIdentifier } from "../../items";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { getItemThumbnailUrl } from "../../resources/get-item-thumbnail-url";
import { getHubRelativeUrl } from "../../content/_internal/internalContentUtils";
import { getItemHomeUrl } from "../../urls";

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
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }

  return {
    self: getItemHomeUrl(item.id, requestOptions),
    siteRelative: getHubRelativeUrl(item.type, item.id, item.typeKeywords),
    siteRelativeEntityType: getHubRelativeUrl("page"),
    layoutRelative: `/pages/${item.id}/edit`,
    workspaceRelative: getRelativeWorkspaceUrl(item.type, item.id),
    thumbnail: getItemThumbnailUrl(item, requestOptions, token),
  };
}
