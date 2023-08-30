import {
  ArcGISRequestError,
  IAuthenticationManager,
} from "@esri/arcgis-rest-request";
import {
  IAddOrInviteEmail,
  IAddOrInviteToGroupResult,
  IUserWithOrgType,
} from "../types";
import { addOrInviteUsersToGroup } from "./addOrInviteUsersToGroup";

/**
 * addOrInviteUsersToGroups adds/invites N users to N groups
 * Initial entry point function for add/invite members flow
 * when dealing with multiple groups.
 * Responses from each group are then consolidated into the final returned object.
 *
 * @export
 * @param {string[]} groupIds array of groups we are adding users to
 * @param {IUserWithOrgType[]} users array of users to add to those groups
 * @param {IAuthenticationManager} primaryRO primary requestOptions
 * @param {boolean} [canAutoAddUser=false] Can we automatically add a user to the group?
 * @param {boolean} [addUserAsGroupAdmin=false] Can the user be added to a group as an administrator of that group?
 * @param {IAddOrInviteEmail} [email] Email object contains auth for the email && the email object itself
 * @return {*}  {Promise<{
 *   notAdded: string[];
 *   notInvited: string[];
 *   notEmailed: string[];
 *   errors: ArcGISRequestError[];
 *   responses: IAddOrInviteToGroupResult[];
 * }>} Results object
 */
export async function addOrInviteUsersToGroups(
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
  responses: IAddOrInviteToGroupResult[];
}> {
  let notAdded: string[] = [];
  let notInvited: string[] = [];
  let notEmailed: string[] = [];
  let errors: ArcGISRequestError[] = [];
  const responses: IAddOrInviteToGroupResult[] = [];
  // need to for..of loop this as a reduce will overwrite promises during execution
  // this way we get an object of each group id nicely.
  for (const groupId of groupIds) {
    // For each group we'll add the users to them.
    const result = await addOrInviteUsersToGroup(
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
