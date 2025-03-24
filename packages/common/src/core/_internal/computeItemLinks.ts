import type { IItem } from "../../rest/types";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemHomeUrl } from "../../urls";
import { IHubEntityLinks } from "../../core/types";
import { getItemIdentifier } from "../../items";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { getItemThumbnailUrl } from "../../resources/get-item-thumbnail-url";
import { getHubRelativeUrl } from "../../content/_internal/internalContentUtils";

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
    const session: UserSession = requestOptions.authentication as UserSession;
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
