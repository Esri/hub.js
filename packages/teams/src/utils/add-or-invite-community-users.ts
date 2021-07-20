import { IAddOrInviteContext, IAddOrInviteResponse } from "../types";
import { handleNoUsers } from "./handle-no-users";
import { processAutoAddUsers } from "./process-auto-add-users";
import { processInviteUsers } from "./process-invite-users";

export async function addOrInviteCommunityUsers(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // If there are no community users return handling no users
  if (!context.community || context.community.length === 0) {
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
