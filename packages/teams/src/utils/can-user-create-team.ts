import type { IUser } from "@esri/arcgis-rest-portal";
import {
  IHubRequestOptions,
  getProp,
  getHubProduct,
  getSubscriptionType,
} from "@esri/hub-common";
import { HubTeamType } from "../types";
import { getUserCreatableTeams } from "./get-user-creatable-teams";
import { getOrgGroupLimit } from "./getOrgGroupLimit";

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
  const userGroupLimit = getOrgGroupLimit(user.orgId) - 2;
  if (userGroups.length > userGroupLimit) {
    return false;
  } else {
    const portalSelf = hubRequestOptions.portalSelf;
    const product = getHubProduct(portalSelf);
    const subscriptionType = getSubscriptionType(portalSelf);
    // get all the groups the user can create in this product...
    return getUserCreatableTeams(user, product, subscriptionType).some(
      (t) => t.config.type === hubTeamType
    );
  }
}
