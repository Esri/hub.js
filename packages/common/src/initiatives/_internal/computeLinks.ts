import { IItem } from "@esri/arcgis-rest-types";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemHomeUrl } from "../../urls";
import { IHubEntityLinks } from "../../core/types";
import { getItemIdentifier } from "../../items";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { getItemThumbnailUrl } from "../../resources/get-item-thumbnail-url";

/**
 * Compute the links that get appended to a Hub Initiative
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
    // TODO: once the initiative view is moved to initiatives/:id,
    // update and leverage the getHubRelativeUrl util to construct
    // this url. For now, we hard-code to the initiatives2/:id route
    siteRelative: `/initiatives2/${getItemIdentifier(item)}`,
    workspaceRelative: getRelativeWorkspaceUrl(
      item.type,
      getItemIdentifier(item)
    ),
    thumbnail: getItemThumbnailUrl(item, requestOptions, token),
  };
}
