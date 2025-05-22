import type { IUser } from "@esri/arcgis-rest-portal";
import { cloneObject, HubProduct } from "@esri/hub-common";
import { WELLKNOWNTEAMS } from "../well-known-teams";
import { canUserCreateTeamInProduct } from "./can-user-create-team-in-product";
import { IGroupTemplate } from "../types";
import { removeInvalidPrivs } from "./remove-invalid-privs";
import { applyPrivPropValuesToTemplate } from "./apply-priv-prop-values-to-template";

// TODO: Remove portalApiVersion at next breaking change
/**
 * Return array of group templates that the current user has licensing
 * and privs to create in the current environment (AGO vs Portal)
 * @param {object} user
 * @param {string} environment
 * @param {string} portalApiVersion
 * @param {string} subscriptionInfoType
 */
export function getUserCreatableTeams(
  user: IUser,
  environment: HubProduct,
  subscriptionInfoType: string = ""
): IGroupTemplate[] {
  const teams = WELLKNOWNTEAMS;
  // Online is not properly respecting addExternalMembersToGroup for
  // certain subscription types known ones so far: Trial, personal use, developer, and evaluation
  const updatedUser = removeInvalidPrivs(user, subscriptionInfoType);

  // Update templates and remove the ones that aren't applicable.
  return cloneObject(teams).reduce((acc, teamTmpl) => {
    // Update template based on privPropValue
    const copyTemplate = applyPrivPropValuesToTemplate(updatedUser, teamTmpl);
    // If the user can create the team....
    if (canUserCreateTeamInProduct(updatedUser, environment, copyTemplate)) {
      // Add the team to the accumulator
      acc.push(copyTemplate);
    }
    return acc;
  }, []);
}
