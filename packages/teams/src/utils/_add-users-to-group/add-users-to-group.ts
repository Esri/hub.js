import { IUser } from "@esri/arcgis-rest-portal";
import {
  cloneObject,
  getProp,
  getWithDefault,
  IHubRequestOptions
} from "@esri/hub-common";
import { IConsolidatedResult, IEmail } from "./interfaces";
import { _consolidateResults } from "./_consolidate-results";
import { _processAutoAdd } from "./_process-auto-add";
import { _processInvite } from "./_process-invite";
import { _processPrimaryEmail } from "./_process-primary-email";
import { _processSecondaryEmail } from "./_process-secondary-email";
import { _getAutoAddUsers } from "./_get-auto-add-users";
import { _getEmailUsers } from "./_get-email-users";
import { _getInviteUsers } from "./_get-invite-users";

/**
 * Adds, invites or emails users about joining a group
 * based on the permissions of the requesting user. The
 * function returns a hash of results indicating which
 * operations were attempted and whether they were successful.
 *
 * In general, this algorithm will auto-add all the users
 * that it can, invite the others, and send emails to eligible
 * invited users (See below for more details)
 *
 * Here are a couple caveats to be aware of:
 * 1) If the requestingUser can auto-add to the group (A.K.A. has
 * portal:admin:assignToGroups) no email will be sent, period.
 * 2) Emails can only be sent to members of the same org as the
 * requesting user if they have been invited (not auto-added)
 * to the group. If emails must to be sent to invited members
 * of a second org (e.g a community org), an authenticated user
 * of the second org must be passed in (see secondaryRO)
 * 3) If no email is passed in, no email will be sent
 * 4) If auto-adding fails, the unadded users will be invited
 *
 * @param {string} groupId
 * @param {IUser[]} allUsers
 * @param {IHubRequestOptions} primaryRO Info and authentication for the requesting user
 * @param {IEmail} [email] Email to be sent (if qualifying users are passed in)
 * @param {IHubRequestOptions} [secondaryRO] Info and authentication for emailing members of a secondary organization (typically a community org)
 *
 * @returns {IConsolidatedResult} The operations attempted, whether they were successful and any errors
 */
export function addUsersToGroup(
  groupId: string,
  allUsers: IUser[],
  primaryRO: IHubRequestOptions,
  email?: IEmail,
  secondaryRO?: IHubRequestOptions
): Promise<IConsolidatedResult> {
  // Extract requesting user
  const requestingUser = cloneObject(
    getWithDefault(primaryRO, "portalSelf.user", {})
  );
  requestingUser.cOrgId = getProp(
    primaryRO,
    "portalSelf.portalProperties.hub.settings.communityOrg.orgId"
  );

  // Context for each process segment
  const context = {
    groupId,
    allUsers,
    primaryRO,
    email,
    secondaryRO,
    requestingUser,
    usersToAutoAdd: _getAutoAddUsers(allUsers, requestingUser),
    usersToInvite: _getInviteUsers(allUsers, requestingUser),
    usersToEmail: _getEmailUsers(
      allUsers,
      requestingUser,
      getProp(email, "copyMe")
    )
  };

  return _processAutoAdd(context)
    .then(_processInvite)
    .then(_processPrimaryEmail)
    .then(_processSecondaryEmail)
    .then(_consolidateResults);
}
