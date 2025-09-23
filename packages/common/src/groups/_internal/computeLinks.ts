import type { IGroup } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { getGroupHomeUrl } from "../../urls/getGroupHomeUrl";
import { getGroupThumbnailUrl } from "../../search/utils";
import { getHubRelativeUrl } from "../../content/_internal/internalContentUtils";
import { IHubEntityLinks } from "../../core/types/IHubEntityBase";

/**
 * Compute the links that get appended to a Hub Group
 * search result and entity
 *
 * @param group
 * @param requestOptions
 */
export function computeLinks(
  group: IGroup,
  requestOptions: IRequestOptions
): IHubEntityLinks {
  let token: string;
  if (requestOptions.authentication) {
    const session: ArcGISIdentityManager =
      requestOptions.authentication as ArcGISIdentityManager;
    token = session.token;
  }

  return {
    self: getGroupHomeUrl(group.id, requestOptions),
    siteRelative: `/groups/${group.id}`,
    siteRelativeEntityType: getHubRelativeUrl("Group"),
    workspaceRelative: getRelativeWorkspaceUrl("Group", group.id),
    thumbnail: getGroupThumbnailUrl(requestOptions.portal, group, token),
  };
}
