import { IUser } from "@esri/arcgis-rest-auth";
import { cloneObject, HubProduct } from "@esri/hub-common";
import { WELLKNOWNTEAMS } from "./well-known-teams";
import { canUserCreateTeamInProduct } from "./can-user-create-team-in-product";
import { IGroupTemplate } from "./types";

/**
 * Return array of group templates that the current user has licensing
 * and privs to create in the current environment (AGO vs Portal)
 * @param {object} user
 * @param {string} environment
 */
export function getUserCreatableTeams(
  user: IUser,
  environment: HubProduct
): IGroupTemplate[] {
  // create partially applied filter fn...
  const filterFn = (tmpl: IGroupTemplate) => {
    return canUserCreateTeamInProduct(user, environment, tmpl);
  };
  // get the templates current user can create in this environment...
  return cloneObject(WELLKNOWNTEAMS).filter(filterFn);
}
