import { IAddOrInviteContext, IAddOrInviteResponse } from "../types";
import { handleNoUsers } from "./handle-no-users";
import { processInviteUsers } from "./process-invite-users";

/**
 * @private
 * Handles add/invite logic for world users
 * It either returns an empty instance of the add/invite response
 * object, or a populated version from processInviteUsers
 *
 * @export
 * @param {IAddOrInviteContext} context Context object
 * @return {IAddOrInviteResponse} Response object
 */
export async function addOrInviteWorldUsers(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // If there are no world users return handling no users
  if (!context.world || context.world.length === 0) {
    // we return an empty object because
    // if you leave out any of the props
    // from the final object and you are concatting together arrays you can concat
    // an undeifined inside an array which will throw off array lengths.
    return handleNoUsers();
  }
  // process invite
  return processInviteUsers(context, "world");
}
