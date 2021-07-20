import { IAddOrInviteContext, IAddOrInviteResponse } from "../types";
import { handleNoUsers } from "./handle-no-users";
import { processAutoAddUsers } from "./process-auto-add-users";
import { processInviteUsers } from "./process-invite-users";

export async function addOrInviteOrgUsers(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // If there are no org users return handling no users
  if (!context.org || context.org.length === 0) {
    return handleNoUsers();
  }
  // for org user if you have assignUsers then auto add the user
  // if not then invite the user
  return context.canAutoAddUser
    ? processAutoAddUsers(context, "org")
    : processInviteUsers(context, "org");
}
