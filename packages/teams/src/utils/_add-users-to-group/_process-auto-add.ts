import { getProp } from "@esri/hub-common";
import { IAddMemberContext } from "./interfaces";
import { autoAddUsers } from "./auto-add-users";
import { _formatAutoAddResponse } from "./_format-auto-add-response";

/**
 * @private
 */
export function _processAutoAdd(
  context: IAddMemberContext
): Promise<IAddMemberContext> {
  return autoAddUsers(
    getProp(context, "groupId"),
    getProp(context, "usersToAutoAdd"),
    getProp(context, "primaryRO.authentication")
  ).then(rawResponse => _formatAutoAddResponse(rawResponse, context));
}
