import {
  ArcGISRequestError,
  IAuthenticationManager,
} from "@esri/arcgis-rest-request";
import { addOrInviteUsersToTeam } from "./add-or-invite-users-to-team";
import {
  IAddOrInviteEmail,
  IAddOrInviteToTeamResult,
  IUserWithOrgType,
} from "./types";

/**
 * addOrInviteUsersToTeams adds/invites N users to N teams
 * Initial entry point function for add/invite members flow
 * when dealing with multiple teams.
 *
 * @export
 * @param {string[]} groupIds array of groups we are adding users to
 * @param {IUserWithOrgType[]} users array of users to add to those teams
 * @param {IAuthenticationManager} primaryRO primary requestOptions
 * @param {boolean} [canAutoAddUser=false] Can we automatically add a user to the team?
 * @param {boolean} [addUserAsGroupAdmin=false] Can the user be added to a team as an administrator of that team?
 * @param {IAddOrInviteEmail} [email] Email object contains auth for the email && the email object itself
 * @return {*}  {Promise<{
 *   notAdded: string[];
 *   notInvited: string[];
 *   notEmailed: string[];
 *   errors: ArcGISRequestError[];
 *   responses: IAddOrInviteToTeamResult[];
 * }>} Results object
 */
export async function addOrInviteUsersToTeams(
  groupIds: string[],
  users: IUserWithOrgType[],
  primaryRO: IAuthenticationManager,
  canAutoAddUser: boolean = false,
  addUserAsGroupAdmin: boolean = false,
  email?: IAddOrInviteEmail
): Promise<{
  notAdded: string[];
  notInvited: string[];
  notEmailed: string[];
  errors: ArcGISRequestError[];
  responses: IAddOrInviteToTeamResult[];
}> {
  let notAdded: string[] = [];
  let notInvited: string[] = [];
  let notEmailed: string[] = [];
  let errors: ArcGISRequestError[] = [];
  const responses: IAddOrInviteToTeamResult[] = [];
  // need to for..of loop this as a reduce will overwrite promises during execution
  // this way we get an object of each group id nicely.
  for (const groupId of groupIds) {
    // For each group we'll add the users to them.
    const result = await addOrInviteUsersToTeam(
      groupId,
      users,
      primaryRO,
      canAutoAddUser,
      addUserAsGroupAdmin,
      email
    );
    // attach each groups results
    responses.push(result);
    // surface results to the top of the stack...
    notAdded = notAdded.concat(result.notAdded);
    errors = errors.concat(result.errors);
    notInvited = notInvited.concat(result.notInvited);
    notEmailed = notEmailed.concat(result.notEmailed);
  }
  // Return built up result object.
  return {
    notAdded,
    notInvited,
    notEmailed,
    errors,
    responses,
  };
}
