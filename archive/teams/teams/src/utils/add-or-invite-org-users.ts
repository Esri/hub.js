import { IAddOrInviteContext, IAddOrInviteResponse } from "../types";
import { handleNoUsers } from "./handle-no-users";
import { processAutoAddUsers } from "./process-auto-add-users";
import { processInviteUsers } from "./process-invite-users";

/**
 * @private
 * Handles add/invite logic for Org users
 * It returns either an empty instance of the addOrInviteResponse
 * object, or either ther esponse from processing auto adding a users or inviting a user
 *
 * @export
 * @param {IAddOrInviteContext} context context object
 * @return {IAddOrInviteResponse} response object
 */
export async function addOrInviteOrgUsers(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // If there are no org users return handling no users
  if (!context.org || context.org.length === 0) {
    // we return an empty object because
    // if you leave out any of the props
    // from the final object and you are concatting together arrays you can concat
    // an undeifined inside an array which will throw off array lengths.
    return handleNoUsers();
  }
  // for org user if you have assignUsers then auto add the user
  // if not then invite the user
  return context.canAutoAddUser
    ? processAutoAddUsers(context, "org")
    : processInviteUsers(context, "org");
}
