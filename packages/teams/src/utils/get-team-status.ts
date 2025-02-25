import { IItem, IUser } from "@esri/arcgis-rest-types";
import { getProp, IHubRequestOptions } from "@esri/hub-common";
import { getTeamById } from "./get-team-by-id";
import { ITeamStatus } from "../types";
import { canUserCreateTeam } from "./can-user-create-team";
import { TYPEMAP } from "./type-map";

/**
 * Given an item, a teamType and a user, return the status
 * of the team ('ok', 'missing', 'broken', 'fixable' ), along
 * with specific details:
 * id: id of the group
 * isMissing: was the group simply never created?
 * isBroken: true if the item has an id for the group, but the group can not be found
 * canFix: true if user can create the group
 * If a team that a route depends on returns `isBroken` the route should redirect
 * to /teams/repair, which will do a full inspection, list things that are broken
 * and then conduct any repairs that can be done. It will list the issues, with
 * the intent of training customers to NOT mess with Team groups in AGO.
 * Once repairs are complete, the user will click a button to return to the route they
 * we attempting to enter before this diversion.
 *
 * @export
 * @param {IItem} item Site or Initiative ITEM (not model)
 * @param {("core" | "content" | "followers")} teamType Type of team to check for
 * @param {IUser} user User Object
 * @param {IHubRequestOptions} ro Auth
 * @return {*}  {Promise<ITeamStatus>}
 */
export async function getTeamStatus(
  item: IItem,
  teamType: "core" | "content" | "followers",
  user: IUser,
  ro: IHubRequestOptions
): Promise<ITeamStatus> {
  // Set up Team status result object
  const result: ITeamStatus = {
    teamType,
    id: null,
    isOk: false,
    isMissing: true,
    isBroken: false,
    canFix: false,
    isMember: false,
  };
  // Get id out of item.properties.[the team type]
  const id = getProp(getProp(item, "properties"), TYPEMAP[teamType]);
  // If there's an id...
  if (id) {
    try {
      // Check to see if the team exists
      const group = await getTeamById(id, ro);
      // if it does..
      if (group) {
        result.id = id;
        result.isOk = true;
        result.isMissing = false;
      } else {
        // If it doesn't, then check to see if user can Create team
        result.id = id;
        result.isBroken = true;
        result.canFix = await canUserCreateTeam(user, teamType, ro);
      }
    } catch (ex) {
      // If the search errors then check if user can create team
      result.id = id;
      result.isBroken = true;
      result.canFix = await canUserCreateTeam(user, teamType, ro);
    }
  } else {
    // If there is not an id then check if the user can create the team
    result.canFix = await canUserCreateTeam(user, teamType, ro);
  }
  return result;
}
