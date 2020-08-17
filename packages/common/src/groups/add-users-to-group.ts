import {
  createOrgNotification,
  ICreateOrgNotificationOptions,
  ICreateOrgNotificationResult,
  IUser
} from "@esri/arcgis-rest-portal";

import { IAuthenticationManager } from "@esri/arcgis-rest-request";

export interface IEmail {
  subject?: string;
  body?: string;
  copyMe?: boolean;
}

// /// //////////////////////////
// // Add Group Member Workflow
// /// //////////////////////////

// /**
//  * Adds, invites or emails users about joining a group
//  * based on the permissions of the requesting user. The
//  * function returns a hash of results indicating which
//  * operations were attempted and whether they were successful.
//  *
//  * In general, this algorithm will auto-add all the users
//  * that it can, invite the others, and send emails to eligible
//  * invited users (See below for more details)
//  *
//  * Here are a couple caveats to be aware of:
//  * 1) If the requestingUser can auto-add to the group (A.K.A. has
//  * portal:admin:assignToGroups) no email will be sent, period.
//  * 2) Emails can only be sent to members of the same org as the
//  * requesting user if they have been invited (not auto-added)
//  * to the group. If emails must to be sent to invited members
//  * of a second org (e.g a community org), an authenticated user
//  * of the second org must be passed in (see secondaryRO)
//  * 3) If no email is passed in, no email will be sent
//  * 4) If auto-adding fails, the unadded users will be invited
//  *
//  *
//  * TODO: Define interfaces for param/return types
//  *
//  * @param {string} groupId
//  * @param {object[]} usersToAdd
//  * @param {object} primaryRO Info and authentication for the requesting user
//  * @param {object} email Email to be sent (if qualifying users are passed in)
//  * @param {object} secondaryRO Info and authentication for emailing members of a secondary organization (typically a community org)
//  *
//  * @returns {object} The operations attempted, whether they were successful and any errors
//  */
// // export function addUsersToGroup (groupId, usersToAdd, primaryRO, email, secondaryRO) {
// //   // Extract requesting user
// //   const requestingUser = cloneObject(getWithDefault(primaryRO, 'portalSelf.user', {}));
// //   requestingUser.cOrgId = getProp(primaryRO, 'portalSelf.portalProperties.hub.settings.communityOrg.orgId');

// //   // Context for each process segment
// //   const context = {
// //     groupId,
// //     usersToAdd,
// //     primaryRO,
// //     email,
// //     secondaryRO,
// //     requestingUser,
// //     usersToAutoAdd: _getAutoAddUsers(usersToAdd, requestingUser),
// //     usersToInvite: _getInviteUsers(usersToAdd, requestingUser),
// //     usersToEmail: _getEmailUsers(usersToAdd, requestingUser, getProp(email, 'copyMe')),
// //   };

// //   return _processAutoAdd(context)
// //     .then(_processInvite)
// //     .then(_processPrimaryEmail)
// //     .then(_processSecondaryEmail)
// //     .then(_consolidateResults);
// // }

// // /**
// //  * @private
// //  */
// // export function _processAutoAdd (context) {
// //   return autoAddUsers(
// //     getProp(context, 'groupId'),
// //     getProp(context, 'usersToAutoAdd'),
// //     getProp(context, 'primaryRO.authentication')
// //   )
// //   .then((rawResponse) => _formatAutoAddResponse(rawResponse, context));
// // }

// // /**
// //  * @private
// //  */
// // export function _formatAutoAddResponse (rawResponse, context) {
// //   if (rawResponse) {
// //     const success = !rawResponse.notAdded.length;
// //     context.autoAddResult = { success };

// //     if (!success) {
// //       const error = { message: `Users not auto-added: ${rawResponse.notAdded.join(', ')}` };
// //       context.autoAddResult.errors = [error];

// //       // Move unadded users to invite list;
// //       const unaddedUsers = context.usersToAdd.filter(user => rawResponse.notAdded.includes(user.username));
// //       context.usersToInvite = context.usersToInvite.concat(unaddedUsers);
// //     }
// //   }

// //   return context;
// // }

// // /**
// //  * @private
// //  */
// // export function _processInvite (context) {
// //   return inviteUsers(
// //     getProp(context, 'groupId'),
// //     getProp(context, 'usersToInvite'),
// //     getProp(context, 'primaryRO.authentication')
// //   )
// //   .then((result) => {
// //     context.inviteResult = result;
// //     return context;
// //   });
// // }

// // /**
// //  * @private
// //  */
// // export function _isOrgAdmin (user) {
// //   return user.role === 'org_admin' && !user.roleId;
// // }

// // /**
// //  * @private
// //  */
// // export function _processPrimaryEmail (context) {
// //   let response = context;
// //   // Email users if invite succeeds
// //   if (context.email && getProp(context, 'inviteResult.success')) {
// //     response = emailOrgUsers(
// //       context.usersToEmail,
// //       context.email,
// //       context.primaryRO.authentication,
// //       _isOrgAdmin(context.requestingUser)
// //     )
// //     .then((result) => {
// //       context.primaryEmailResult = result;
// //       return context;
// //     });
// //   }

// //   return response;
// // }

// // /**
// //  * @private
// //  */
// // export function _processSecondaryEmail (context) {
// //   let response = context;

// //   // If secondaryRO provided, send email to the invited users in the secondaryRO's org (typically a community org)
// //   if (context.email && context.secondaryRO && getProp(context, 'inviteResult.success')) {
// //     const secondaryUser = getWithDefault(context, 'secondaryRO.portalSelf.user', {});
// //     const secondaryOrgUsersToEmail = context.usersToInvite.filter(u => _canEmailUser(u, secondaryUser));

// //     response = emailOrgUsers(
// //       secondaryOrgUsersToEmail,
// //       context.email,
// //       context.secondaryRO.authentication,
// //       _isOrgAdmin(secondaryUser)
// //     )
// //     .then((result) => {
// //       context.secondaryEmailResult = result;
// //       return context;
// //     });
// //   }

// //   return response;
// // }

// // /**
// //  * @private
// //  */
// // export function _consolidateResults (context) {
// //   const { autoAddResult, inviteResult, primaryEmailResult, secondaryEmailResult } = context;

// //   let combinedEmailResults;
// //   if (primaryEmailResult || secondaryEmailResult) {
// //     const validResults = [primaryEmailResult, secondaryEmailResult].filter(r => r);
// //     const combinedSuccess = validResults.every(r => r.success);
// //     const combinedErrors = validResults.reduce((collection, r) => collection.concat(r.errors || []), []);
// //     combinedEmailResults = {
// //       success: combinedSuccess,
// //     };
// //     if (combinedErrors.length) {
// //       combinedEmailResults.errors = combinedErrors;
// //     }
// //   }

// //   const overallSuccess = [autoAddResult, inviteResult, combinedEmailResults].filter(r => r).every(r => r.success);

// //   return {
// //     success: overallSuccess,
// //     autoAdd: autoAddResult,
// //     invite: inviteResult,
// //     email: combinedEmailResults,
// //   };
// // }

// // /// //////////////////////////////
// // // Individual Workflow Sections
// // /// //////////////////////////////
// // /**
// //  *
// //  * Attempts to auto-add users to a group
// //  * TODO: Add interfaces
// //  *
// //  * @param {string} id ID of the group the users will be added to
// //  * @param {object[]} users
// //  * @param {object} authentication
// //  *
// //  * @returns {object|undefined} Result of the transaction (undefined if no users are passed in)
// //  */
// // export function autoAddUsers (id, users, authentication) {
// //   let response = Promise.resolve();
// //   if (users.length) {
// //     const args = { id, users: users.map(u => u.username), authentication };
// //     response = addGroupUsers(args);
// //   }

// //   return response;
// // }

/**
 *
 * Attempts to invite users to a group
 *
 * @param {string} id ID of the group the users will be invited to
 * @param {object[]} users
 * @param {object} authentication
 * @param {number} expiration How long the invite will be active in minutes
 *
 * @returns {object|null} Result of the transaction (null if no users are passed in)
 */
// export function inviteUsers (
//   id: string,
//   users: IUser[],
//   authentication: IAuthenticationManager,
//   expiration = 20160
// ) { // default to 2 week expiration TODO: is this actually 2 weeks?
//   let response = Promise.resolve();
//   if (users.length) {
//     const args = { id, users: users.map(u => u.username), authentication, role: 'group_member', expiration };
//     response = inviteGroupUsers(args);
//   }

//   return response;
// }

/**
 * Attempts to email members of the requesting user's organization.
 *
 * @param {IUser[]} users Users to email (must be in the same org as the requesting user)
 * @param {IEmail} email
 * @param {IAuthenticationManager} authentication
 * @param {boolean} isOrgAdmin // Whether the requesting user in an org admin
 *
 * @returns {object|null} A promise that resolves to the result of the transaction (null if no users are passed in)
 */
export function emailOrgUsers(
  users: IUser[],
  email: IEmail,
  authentication: IAuthenticationManager,
  isOrgAdmin: boolean
): Promise<ICreateOrgNotificationResult> {
  let response: Promise<ICreateOrgNotificationResult> = Promise.resolve(null);
  if (users.length) {
    const args: ICreateOrgNotificationOptions = {
      authentication,
      message: email.body,
      subject: email.subject,
      notificationChannelType: "email",
      users: users.map(u => u.username)
    };
    if (!isOrgAdmin) {
      args.batchSize = 1;
    }
    response = createOrgNotification(args);
  }

  return response;
}

/// ///////////////////////////
// Add Member Helpers
/// ///////////////////////////

/**
 * @private
 */
export function _getAutoAddUsers(users: IUser[], requestingUser: IUser) {
  let autoAddUsers: IUser[] = [];
  if (requestingUser.privileges.indexOf("portal:admin:assignToGroups") !== -1) {
    const orgIds = [requestingUser.orgId, requestingUser.cOrgId].filter(o => o);
    autoAddUsers = users.filter(u => orgIds.indexOf(u.orgId) !== -1);
  }

  return autoAddUsers;
}

/**
 * @private
 */
export function _getInviteUsers(users: IUser[], requestingUser: IUser) {
  const autoAddedUsers = _getAutoAddUsers(users, requestingUser);
  return users.filter(
    user => !autoAddedUsers.some(aau => aau.username === user.username)
  );
}

/**
 * @private
 */
export function _getEmailUsers(
  users: IUser[],
  requestingUser: IUser,
  includeSelf = false
) {
  const invitedUsers = _getInviteUsers(users, requestingUser);
  const emailUsers = invitedUsers.filter(user =>
    _canEmailUser(user, requestingUser)
  );
  if (includeSelf) {
    emailUsers.push(requestingUser);
  }
  return emailUsers;
}

/**
 * @private
 */
export function _canEmailUser(recipient: IUser, sender: IUser) {
  return recipient.orgId === sender.orgId;
}
