import { IAddOrInviteContext, IAddOrInviteResponse } from "../types";
import { handleNoUsers } from "./handle-no-users";
import { processAutoAddUsers } from "./process-auto-add-users";
import { processInviteUsers } from "./process-invite-users";

/**
 * @private
 * Handles add/invite logic for community users
 * It returns either an empty instance of the addOrInviteResponse
 * object, or either ther esponse from processing auto adding
 * users or inviting users. If an email has been passed in it also notifies
 * processAutoAddUsers that emails should be sent.
 *
 * @export
 * @param {IAddOrInviteContext} context context object
 * @return {IAddOrInviteResponse} response object
 */
export async function addOrInviteCommunityUsers(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // We default to handleNoUsers
  // we return an empty object because
  // if you leave out any of the props
  // from the final object and you are concatting together arrays you can concat
  // an undeifined inside an array which will throw off array lengths.
  let fnToCall = handleNoUsers;
  let shouldEmail = false;

  // If community users were passed in...
  if (context.community && context.community.length > 0) {
    // Default to either autoAdd or invite based on canAutoAddUser.
    fnToCall = context.canAutoAddUser
      ? processAutoAddUsers
      : processInviteUsers;
    // If we have an email object
    // Then we will auto add...
    // But whether or not we email is still in question
    if (context.email) {
      // If the email object has the groupId property...
      if (context.email.hasOwnProperty("groupId")) {
        // If the email objects groupId property is the same as the current groupId in context...
        // (This function is part of a flow that could work for N groupIds)
        if (context.email.groupId === context.groupId) {
          // Then we auto add and send email
          fnToCall = processAutoAddUsers;
          shouldEmail = true;
        } // ELSE if the groupId's do NOT match, we will fall back
        // To autoAdd or invite as per line 32.
        // We are doing the above logic (lines 43 - 47) because
        // We wish to add users to core teams, followers, and content teams
        // but only to email the core team.
      } else {
        // If it does not have a groupId at all then we will autoAdd and email.
        fnToCall = processAutoAddUsers;
        shouldEmail = true;
      }
    }
  }
  // Return/call the function
  return fnToCall(context, "community", shouldEmail);
}
