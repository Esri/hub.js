import {
  IAddOrInviteContext,
  IAddOrInviteResponse,
  IUserOrgRelationship,
  IUserWithOrgType,
} from "../types";

import { processAutoAddUsers } from "./processAutoAddUsers";
import { processInviteUsers } from "./processInviteUsers";

// Add or invite flow based on the type of user begins here

/**
 * @private
 * Handles add/invite logic for collaboration coordinators inside partnered orgs.
 * This is intentionally split out from the invitation of partnered org normal members,
 * because the two types of partnered org usres (regular and collaboration coordinator)
 * always come from the same 'bucket', however have distinctly different add paths Invite vs auto add.
 * It returns either an empty instance of the addOrInviteResponse
 * object, or their response from auto adding users.
 *
 * @export
 * @param {IAddOrInviteContext} context context object
 * @return {IAddOrInviteResponse} response object
 */
export async function addOrInviteCollaborationCoordinators(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // If there are no org users return handling no users
  if (
    !context.collaborationCoordinator ||
    context.collaborationCoordinator.length === 0
  ) {
    // we return an empty object because
    // if you leave out any of the props
    // from the final object and you are concatting together arrays you can concat
    // an undeifined inside an array which will throw off array lengths.
    return handleNoUsers();
  }
  return processAutoAddUsers(context, "collaborationCoordinator");
}

/**
 * @private
 * Handles add/invite logic for community users
 * It returns either an empty instance of the addOrInviteResponse
 * object, or either ther esponse from processing auto adding
 * users or inviting users. If an email has been passed in it also notifies
 * processAutoAddUsers that emails should be sent.
 *
 * @export
 * @param {IAddOrInviteContext} context context object
 * @return {IAddOrInviteResponse} response object
 */
export async function addOrInviteCommunityUsers(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // We default to handleNoUsers
  // we return an empty object because
  // if you leave out any of the props
  // from the final object and you are concatting together arrays you can concat
  // an undeifined inside an array which will throw off array lengths.
  let fnToCall = handleNoUsers;
  let shouldEmail = false;

  // If community users were passed in...
  if (context.community && context.community.length > 0) {
    // Default to either autoAdd or invite based on canAutoAddUser.
    fnToCall = context.canAutoAddUser
      ? processAutoAddUsers
      : processInviteUsers;
    // If we have an email object
    // Then we will auto add...
    // But whether or not we email is still in question
    if (context.email) {
      // If the email object has the groupId property...
      if (context.email.hasOwnProperty("groupId")) {
        // If the email objects groupId property is the same as the current groupId in context...
        // (This function is part of a flow that could work for N groupIds)
        if (context.email.groupId === context.groupId) {
          // Then we auto add and send email
          fnToCall = processAutoAddUsers;
          shouldEmail = true;
        } // ELSE if the groupId's do NOT match, we will fall back
        // To autoAdd or invite as per line 32.
        // We are doing the above logic (lines 43 - 47) because
        // We wish to add users to core groups, followers, and content groups
        // but only to email the core group.
      } else {
        // If it does not have a groupId at all then we will autoAdd and email.
        fnToCall = processAutoAddUsers;
        shouldEmail = true;
      }
    }
  }
  // Return/call the function
  return fnToCall(context, "community", shouldEmail);
}

/**
 * @private
 * Handles add/invite logic for Org users
 * It returns either an empty instance of the addOrInviteResponse
 * object, or either ther esponse from processing auto adding a users or inviting a user
 *
 * @export
 * @param {IAddOrInviteContext} context context object
 * @return {IAddOrInviteResponse} response object
 */
export async function addOrInviteOrgUsers(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // If there are no org users return handling no users
  if (!context.org || context.org.length === 0) {
    // we return an empty object because
    // if you leave out any of the props
    // from the final object and you are concatting together arrays you can concat
    // an undeifined inside an array which will throw off array lengths.
    return handleNoUsers();
  }
  // for org user if you have assignUsers then auto add the user
  // if not then invite the user
  return context.canAutoAddUser
    ? processAutoAddUsers(context, "org")
    : processInviteUsers(context, "org");
}

/**
 * @private
 * Handles add/invite logic for partnered org users.
 * It returns either an empty instance of the addOrInviteResponse
 * object, or their response from inviting users.
 *
 * @export
 * @param {IAddOrInviteContext} context context object
 * @return {IAddOrInviteResponse} response object
 */
export async function addOrInvitePartneredUsers(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // If there are no org users return handling no users
  if (!context.partnered || context.partnered.length === 0) {
    // we return an empty object because
    // if you leave out any of the props
    // from the final object and you are concatting together arrays you can concat
    // an undeifined inside an array which will throw off array lengths.
    return handleNoUsers();
  }
  // process invite
  return processInviteUsers(context, "partnered");
}

/**
 * @private
 * Handles add/invite logic for world users
 * It either returns an empty instance of the add/invite response
 * object, or a populated version from processInviteUsers
 *
 * @export
 * @param {IAddOrInviteContext} context Context object
 * @return {IAddOrInviteResponse} Response object
 */
export async function addOrInviteWorldUsers(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // If there are no world users return handling no users
  if (!context.world || context.world.length === 0) {
    // we return an empty object because
    // if you leave out any of the props
    // from the final object and you are concatting together arrays you can concat
    // an undeifined inside an array which will throw off array lengths.
    return handleNoUsers();
  }
  // process invite
  return processInviteUsers(context, "world");
}

// Add or invite flow based on the type of user ends here

/**
 * @private
 * Returns an empty instance of the addorinviteresponse object.
 * We are using this because if you leave out any of the props
 * from the final object and you are concatting together arrays you can concat
 * an undeifined inside an array which will throw off array lengths.
 *
 * @export
 * @return {IAddOrInviteResponse}
 */
export async function handleNoUsers(
  context?: IAddOrInviteContext,
  userType?: "world" | "org" | "community" | "partnered",
  shouldEmail?: boolean
): Promise<IAddOrInviteResponse> {
  return {
    notAdded: [],
    notEmailed: [],
    notInvited: [],
    users: [],
    errors: [],
  };
}

/**
 * @private
 * Takes users array and sorts them into an object by the type of user they are
 * based on the orgType prop (world|org|community)
 *
 * @export
 * @param {IUserWithOrgType[]} users array of users
 * @return {IUserOrgRelationship} Object of users sorted by type (world, org, community)
 */
export function groupUsersByOrgRelationship(
  users: IUserWithOrgType[]
): IUserOrgRelationship {
  return users.reduce(
    (acc, user) => {
      // keyof needed to make bracket notation work without TS throwing a wobbly.
      const orgType = user.orgType as keyof IUserOrgRelationship;
      acc[orgType].push(user);
      return acc;
    },
    {
      world: [],
      org: [],
      community: [],
      partnered: [],
      collaborationCoordinator: [],
    }
  );
}
