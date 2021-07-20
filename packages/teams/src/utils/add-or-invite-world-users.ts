import { IAddOrInviteContext, IAddOrInviteResponse } from "../types";
import { handleNoUsers } from "./handle-no-users";
import { processInviteUsers } from "./process-invite-users";

export async function addOrInviteWorldUsers(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // If there are no world users return handling no users
  if (!context.world || context.world.length === 0) {
    return handleNoUsers();
  }
  // process invite
  return processInviteUsers(context, "world");
}
