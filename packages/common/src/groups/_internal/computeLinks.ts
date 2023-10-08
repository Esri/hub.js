import { IGroup } from "@esri/arcgis-rest-types";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IHubEntityLinks } from "../../core/types";
import { getRelativeWorkspaceUrl } from "../../core/getRelativeWorkspaceUrl";
import { getGroupHomeUrl } from "../../urls/getGroupHomeUrl";
import { getGroupThumbnailUrl } from "../../search/utils";

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
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }

  return {
    self: getGroupHomeUrl(group.id, requestOptions),
    siteRelative: `/groups/${group.id}`,
    workspaceRelative: getRelativeWorkspaceUrl("Group", group.id),
    thumbnail: getGroupThumbnailUrl(requestOptions.portal, group, token),
  };
}
