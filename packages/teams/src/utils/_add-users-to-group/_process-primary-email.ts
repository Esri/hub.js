import { getProp } from "@esri/hub-common";
import { IAddMemberContext } from "./interfaces";
import { _isOrgAdmin } from "./_is-org-admin";
import { emailOrgUsers } from "./email-org-users";

/**
 * @private
 *
 * Send email notification if an email object is present and
 * the previous invitation call was successful
 */
export function _processPrimaryEmail(
  context: IAddMemberContext
): Promise<IAddMemberContext> {
  let response: Promise<IAddMemberContext> = Promise.resolve(context);
  // Email users if invite succeeds
  if (context.email && getProp(context, "inviteResult.success")) {
    response = emailOrgUsers(
      context.usersToEmail,
      context.email,
      context.primaryRO.authentication,
      _isOrgAdmin(context.requestingUser)
    ).then(result => {
      context.primaryEmailResult = result;
      return context;
    });
  }

  return response;
}
