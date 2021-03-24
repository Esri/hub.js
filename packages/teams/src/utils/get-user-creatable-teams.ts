import { IUser } from "@esri/arcgis-rest-auth";
import { cloneObject, HubProduct } from "@esri/hub-common";
import { WELLKNOWNTEAMS } from "../well-known-teams";
import { PRE_9_1_WELLKNOWNTEAMS } from "../pre-9-1-well-known-teams";
import { canUserCreateTeamInProduct } from "./can-user-create-team-in-product";
import { IGroupTemplate } from "../types";

/**
 * Return array of group templates that the current user has licensing
 * and privs to create in the current environment (AGO vs Portal)
 * @param {object} user
 * @param {string} environment
 */
export function getUserCreatableTeams(
  user: IUser,
  environment: HubProduct,
  portalApiVersion: string
): IGroupTemplate[] {
  // TODO: remove this when needed (after may 1st 2021)
  // choosing the type of well known team based on the current portal version
  const teams =
    parseFloat(portalApiVersion) < 9.1
      ? PRE_9_1_WELLKNOWNTEAMS
      : WELLKNOWNTEAMS;
  // create partially applied filter fn...
  const filterFn = (tmpl: IGroupTemplate) => {
    return canUserCreateTeamInProduct(user, environment, tmpl);
  };
  // get the templates current user can create in this environment...
  return cloneObject(teams).filter(filterFn);
}
