import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";

import { IHubGroup } from "../../core/types/IHubGroup";
import { IGroup } from "@esri/arcgis-rest-types";
import { isDiscussable } from "../../discussions";
import { getGroupThumbnailUrl } from "../../search/utils";
import { getRelativeWorkspaceUrl } from "../../core";
import { getGroupHomeUrl } from "../../urls";

/**
 * Given a model and a group, set various computed properties that can't be directly mapped
 * @private
 * @param group
 * @param hubGroup
 * @param requestOptions
 * @returns
 */
export function computeProps(
  group: IGroup,
  hubGroup: Partial<IHubGroup>,
  requestOptions: IRequestOptions
): IHubGroup {
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }
  // thumbnail url
  const thumbnailUrl = getGroupThumbnailUrl(
    requestOptions.portal,
    group,
    token
  );
  hubGroup.thumbnailUrl = thumbnailUrl;

  // Handle Dates
  hubGroup.createdDate = new Date(group.created);
  hubGroup.createdDateSource = "group.created";
  hubGroup.updatedDate = new Date(group.modified);
  hubGroup.updatedDateSource = "group.modified";

  hubGroup.type = "Group";

  hubGroup.isDiscussable = isDiscussable(group);

  // This tells us on if the group is an edit/view group.
  // If it has the `updateitemcontrol` capability, it is an edit group
  hubGroup.isSharedUpdate = (group.capabilities || []).includes(
    "updateitemcontrol"
  );

  hubGroup.memberType = group.userMembership?.memberType;

  hubGroup.membershipAccess = "anyone";
  if (group.membershipAccess === "org") {
    hubGroup.membershipAccess = "organization";
  }
  if (group.membershipAccess === "collaboration") {
    hubGroup.membershipAccess = "collaborators";
  }

  hubGroup.canEdit =
    group.userMembership?.memberType === "owner" ||
    group.userMembership?.memberType === "admin";
  hubGroup.canDelete = hubGroup.canEdit;

  hubGroup.links = {
    self: getGroupHomeUrl(group.id, requestOptions),
    siteRelative: `/teams/${group.id}`,
    workspaceRelative: getRelativeWorkspaceUrl("Group", group.id),
    thumbnail: thumbnailUrl,
  };
  // cast b/c this takes a partial but returns a full group
  return hubGroup as IHubGroup;
}
