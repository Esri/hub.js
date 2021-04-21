import { getProp } from "@esri/hub-common";
import { IAddMemberContext } from "./interfaces";
import { inviteUsers } from "./invite-users";

/**
 * @private
 */
export function _processInvite(
  context: IAddMemberContext
): Promise<IAddMemberContext> {
  return inviteUsers(
    getProp(context, "groupId"),
    getProp(context, "usersToInvite"),
    getProp(context, "primaryRO.authentication")
  ).then(result => {
    context.inviteResult = result;
    return context;
  });
}
