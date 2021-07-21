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
  // If there are no community users return handling no users
  if (!context.community || context.community.length === 0) {
    // we return an empty object because
    // if you leave out any of the props
    // from the final object and you are concatting together arrays you can concat
    // an undeifined inside an array which will throw off array lengths.
    return handleNoUsers();
  }
  // If email passed in then auto add
  if (context.email) {
    return processAutoAddUsers(context, "community", true);
  }
  // Otherwise can you autoAdd a user? if yes then do so otherwise invite
  return context.canAutoAddUser
    ? processAutoAddUsers(context, "community")
    : processInviteUsers(context, "community");
}
