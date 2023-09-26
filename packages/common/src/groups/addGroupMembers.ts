import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import { IUser } from "@esri/arcgis-rest-types";
import { failSafe } from "../utils";
import { autoAddUsers } from "./autoAddUsers";
import { inviteUsers } from "./inviteUsers";
import { IAddGroupMembersResult, IAddOrInviteMemberResponse } from "./types";

/**
 * Add or invite N users to a single group.
 * if autoAdd is true (if the user doing the adding has the correct priv as determined outsides of this function)
 * Then we attempt to auto add EVERY user to the group.
 * If that call fails, then we attempt to invite them.
 *
 * @export
 * @param {string} groupId ID of the group the users will be added to
 * @param {string[]} usernames usernames of the users to add
 * @param {IAuthenticationManager} auth Auth
 * @param {boolean} autoAdd should we auto add users?
 * @return {*}  {Promise<IAddGroupMembersResult>}
 */
export async function addGroupMembers(
  groupId: string,
  usernames: string[],
  auth: IAuthenticationManager,
  autoAdd: boolean
): Promise<IAddGroupMembersResult> {
  const added: string[] = [];
  const invited: string[] = [];
  const notAdded: string[] = [];
  const notInvited: string[] = [];
  const responses: IAddOrInviteMemberResponse[] = [];
  // iterate through users as we want a distinct invite call per user due to how
  // batch invites will only respond with success: true/false
  // and if there is an error then it gets priority even though successes do still go through
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
      const addResponse = await failSafeAdd(groupId, [user], auth);
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
      const inviteResponse = await failSafeInvite(groupId, [user], auth);
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
