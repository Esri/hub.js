import { getProp } from "../../../objects/get-prop";
import { IAddMemberContext } from "../interfaces";
import { _isOrgAdmin } from "../utils/_is-org-admin";
import { emailOrgUsers } from "../workflow-sections/email-org-users";

/**
 * @private
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
