import { IUser } from "@esri/arcgis-rest-auth";
import { _canEmailUser } from "./_can-email-user";
import { _isOrgAdmin } from "./_is-org-admin";
import { getProp, getWithDefault } from "@esri/hub-common";
import { IAddMemberContext } from "./interfaces";
import { emailOrgUsers } from "./email-org-users";

/**
 * @private
 *
 * If a secondary authentication is passed in AND
 * an email object is passed in AND
 * the previous invitation call was successful:
 *
 * Send an email notification to the invited
 * users that are part of the secondary authentication's org
 */
export function _processSecondaryEmail(
  context: IAddMemberContext
): Promise<IAddMemberContext> {
  let response: Promise<IAddMemberContext> = Promise.resolve(context);

  // If secondaryRO provided, send email to the invited users in the secondaryRO's org (typically a community org)
  if (
    context.email &&
    context.secondaryRO &&
    getProp(context, "inviteResult.success")
  ) {
    const secondaryUser: IUser = getWithDefault(
      context,
      "secondaryRO.portalSelf.user",
      {}
    );
    const secondaryOrgUsersToEmail = context.usersToInvite.filter(u =>
      _canEmailUser(u, secondaryUser)
    );
    response = emailOrgUsers(
      secondaryOrgUsersToEmail,
      context.email,
      context.secondaryRO.authentication,
      _isOrgAdmin(secondaryUser)
    ).then(result => {
      context.secondaryEmailResult = result;
      return context;
    });
  }

  return response;
}
