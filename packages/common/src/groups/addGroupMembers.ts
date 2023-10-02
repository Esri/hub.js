import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import { IUser } from "@esri/arcgis-rest-types";
import { failSafe } from "../utils";
import { autoAddUsers } from "./autoAddUsers";
import { inviteUsers } from "./inviteUsers";
import { IAddGroupMembersResult, IAddOrInviteMemberResponse } from "./types";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

/**
 * Add or invite N users to a single group.
 * If autoAdd is true (if the user doing the adding has the 'portal:admin:assignToGroups' priv)
 * then we attempt to auto add EVERY user to the group.
 * If that call fails, then we attempt to invite them.
 *
 * @export
 * @param {string} groupId ID of the group the users will be added to
 * @param {string[]} usernames usernames of the users to add
 * @param {IUserRequestOptions} auth Auth
 * @param {boolean} autoAdd should we auto add users?
 * @return {*}  {Promise<IAddGroupMembersResult>}
 */
export async function addGroupMembers(
  groupId: string,
  usernames: string[],
  auth: IUserRequestOptions,
  autoAdd: boolean
): Promise<IAddGroupMembersResult> {
  const added: string[] = [];
  const invited: string[] = [];
  const notAdded: string[] = [];
  const notInvited: string[] = [];
  const responses: IAddOrInviteMemberResponse[] = [];
  // iterate through users as we want a distinct add/invite call per user.
  // This is primarily because batch inviting of users will only return a single consolidated
  // 'success' response, which provides no granularity on which users were actually successfully invited.
  // Similarly errors are consolidated into a single array, which again provides no granularity on which users
  // experienced the error.
  for (const username of usernames) {
    let inviteUser = true;
    const response: IAddOrInviteMemberResponse = {
      username,
      add: null,
      invite: null,
    };
    // expand user into an 'IUser' object for add/invite functions to then extract...
    const user = { username } as IUser;
    // Create failSafe functions for add/invite
    const failSafeAdd = failSafe(autoAddUsers);
    const failSafeInvite = failSafe(inviteUsers);
    // If we can add the user automatically, then attempt to do so
    if (autoAdd) {
      // fail safe add
      const addResponse = await failSafeAdd(
        groupId,
        [user],
        auth.authentication
      );
      // add response to response obj
      response.add = addResponse;
      // if they were added, then don't invite and add to added array
      if (!addResponse.notAdded || addResponse.notAdded.length === 0) {
        inviteUser = false;
        added.push(username);
      } else {
        notAdded.push(username);
      }
    }
    if (inviteUser) {
      // fail safe invite
      const inviteResponse = await failSafeInvite(
        groupId,
        [user],
        auth.authentication
      );
      // add response to response obj
      response.invite = inviteResponse;
      // if they were invited, then add to invited array
      if (inviteResponse.success) {
        invited.push(username);
      } else {
        notInvited.push(username);
      }
    }
    // push response to responses array
    responses.push(response);
  }
  return {
    added,
    invited,
    notAdded,
    notInvited,
    responses,
  };
}
