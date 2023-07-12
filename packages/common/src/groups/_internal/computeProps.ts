import { IRequestOptions } from "@esri/arcgis-rest-request";
import { UserSession } from "@esri/arcgis-rest-auth";
import { processEntityCapabilities } from "../../capabilities";
import { IHubGroup } from "../../core/types/IHubGroup";
import { IGroup } from "@esri/arcgis-rest-types";
import { isDiscussable } from "../../discussions";
import { getGroupThumbnailUrl } from "../../search";
import { GroupDefaultCapabilities } from "./GroupBusinessRules";

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
  hubGroup.thumbnail = getGroupThumbnailUrl(
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

  // Handle capabilities
  group.capabilities = processEntityCapabilities(
    group.capabilities || {},
    GroupDefaultCapabilities
  );

  // cast b/c this takes a partial but returns a full group
  return hubGroup as IHubGroup;
}
