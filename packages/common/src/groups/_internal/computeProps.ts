import { IRequestOptions } from "@esri/arcgis-rest-request";
import type { ArcGISIdentityManager } from "@esri/arcgis-rest-request";
import { IHubGroup } from "../../core/types/IHubGroup";
import type { IGroup } from "@esri/arcgis-rest-portal";
import {
  getDefaultEntitySettings,
  IEntitySetting,
  isDiscussable,
} from "../../discussions";
import { getGroupThumbnailUrl } from "../../search/utils";
import { computeLinks } from "./computeLinks";

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
  entitySettings: Partial<IEntitySetting>,
  requestOptions: IRequestOptions
): IHubGroup {
  let token: string;
  if (requestOptions.authentication) {
    const session: ArcGISIdentityManager =
      requestOptions.authentication as ArcGISIdentityManager;
    token = session.token;
  }
  // thumbnail url
  hubGroup.thumbnailUrl = getGroupThumbnailUrl(
    requestOptions.portal,
    group,
    token
  );

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

  hubGroup.links = computeLinks(group, requestOptions);

  const settings = entitySettings || getDefaultEntitySettings("group");
  hubGroup.entitySettingsId = settings.id ?? null;
  hubGroup.discussionSettings = settings.settings.discussions;

  // cast b/c this takes a partial but returns a full group
  return hubGroup as IHubGroup;
}
