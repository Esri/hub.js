import { IUser } from "@esri/arcgis-rest-auth";
import { IHubRequestOptions } from "../../";
import { createGroup, protectGroup, IGroup } from "@esri/arcgis-rest-portal";
import { getUniqueGroupTitle } from "./get-unique-group-title";
import { getAllowedGroupAccess } from "./get-allowed-group-access";
import { IGroupTemplate } from "../types";

/**
 * Create a team group. Will ensure the team name is unique in the users org
 * and return the group, with appropriate `.userMembership` attached.
 * @param {Object} user Current User
 * @param {Object} group Group to create
 * @param {IHubRequestOptions} hubRequestOptions
 * @private
 */
export function _createTeamGroup(
  user: IUser,
  group: IGroupTemplate,
  hubRequestOptions: IHubRequestOptions
) {
  group.access = getAllowedGroupAccess(
    group.access,
    user,
    hubRequestOptions.portalSelf
  );
  return getUniqueGroupTitle(group.title, hubRequestOptions)
    .then((uniqueTitle) => {
      group.title = uniqueTitle;
      return createGroup({
        group: group as IGroup, // close enough
        authentication: hubRequestOptions.authentication,
      });
    })
    .then((createResponse) => {
      group.id = createResponse.group.id;
      return protectGroup({
        id: group.id,
        authentication: hubRequestOptions.authentication,
      });
    })
    .then(() => {
      group.userMembership = {
        username: user.username,
        memberType: "owner",
        applications: 0,
      };
      return group;
    })
    .catch((ex) => {
      throw Error(`Error in team-utils::_createTeamGroup ${ex}`);
    });
}
