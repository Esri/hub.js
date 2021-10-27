import { handleNoUsers } from "./handle-no-users";
import { IAddOrInviteContext, IAddOrInviteResponse } from "../types";
import { processAutoAddUsers } from "./process-auto-add-users";

/**
 * @private
 * Handles add/invite logic for collaboration coordinators inside partnered orgs.
 * This is intentionally split out from the invitation of partnered org normal members,
 * because the two types of partnered org usres (regular and collaboration coordinator)
 * always come from the same 'bucket', however have distinctly different add paths Invite vs auto add.
 * It returns either an empty instance of the addOrInviteResponse
 * object, or their response from auto adding users.
 *
 * @export
 * @param {IAddOrInviteContext} context context object
 * @return {IAddOrInviteResponse} response object
 */
export async function addOrInviteCollaborationCoordinators(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // If there are no org users return handling no users
  if (
    !context.collaborationCoordinator ||
    context.collaborationCoordinator.length === 0
  ) {
    // we return an empty object because
    // if you leave out any of the props
    // from the final object and you are concatting together arrays you can concat
    // an undeifined inside an array which will throw off array lengths.
    return handleNoUsers();
  }
  return processAutoAddUsers(context, "collaborationCoordinator");
}
