import { getProp } from "../../../objects/get-prop";
import { IAddMemberContext } from "../interfaces";
import { inviteUsers } from "../../inviteUsers";

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
  ).then((result) => {
    context.inviteResult = result;
    return context;
  });
}
