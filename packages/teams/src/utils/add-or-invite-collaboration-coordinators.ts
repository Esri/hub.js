import { handleNoUsers } from "./handle-no-users";
import { IAddOrInviteContext, IAddOrInviteResponse } from "../types";
import { processAutoAddUsers } from "./process-auto-add-users";

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
