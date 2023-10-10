import { IItem } from "@esri/arcgis-rest-types";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getItemHomeUrl } from "../../urls";
import { IHubEntityLinks } from "../../core/types";
import { getItemIdentifier } from "../../items";
import { getHubRelativeUrl } from "../../content/_internal/internalContentUtils";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { getItemThumbnailUrl } from "../../resources/get-item-thumbnail-url";

/**
 * Compute the links that get appended to a Hub Template
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

  // If a solution template is deployed, we don't support
  // managing it in the workspace, so we kick users to AGO
  const isDeployed = item.typeKeywords?.includes("Deployed");
  const itemHomeUrl = getItemHomeUrl(item.id, requestOptions);
  return {
    self: itemHomeUrl,
    siteRelative: getHubRelativeUrl(
      item.type,
      getItemIdentifier(item),
      item.typeKeywords
    ),
    workspaceRelative: isDeployed
      ? itemHomeUrl
      : getRelativeWorkspaceUrl(item.type, getItemIdentifier(item)),
    thumbnail: getItemThumbnailUrl(item, requestOptions, token),
  };
}
