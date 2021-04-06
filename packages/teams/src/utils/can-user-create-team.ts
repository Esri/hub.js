import { IUser } from "@esri/arcgis-rest-auth";
import { IHubRequestOptions, getProp, getHubProduct } from "@esri/hub-common";
import { HubTeamType } from "../types";
import { getUserCreatableTeams } from "./get-user-creatable-teams";

/**
 * Determine if the current user can create a specific type of team
 * @param {Object} user Current User
 * @param {HubTeamType} hubTeamType
 * @param {*} hubRequestOptions
 */
export function canUserCreateTeam(
  user: IUser,
  hubTeamType: HubTeamType,
  hubRequestOptions: IHubRequestOptions
) {
  const userGroups = getProp(user, "groups") || [];
  if (userGroups.length > 510) {
    return false;
  } else {
    const product = getHubProduct(hubRequestOptions.portalSelf);
    // get all the groups the user can create in this product...
    return getUserCreatableTeams(
      user,
      product,
      hubRequestOptions.portalSelf.currentVersion
    ).some(t => t.config.type === hubTeamType);
  }
}
