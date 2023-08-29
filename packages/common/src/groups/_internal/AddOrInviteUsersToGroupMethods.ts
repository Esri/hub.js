import {
  IAddOrInviteContext,
  IAddOrInviteResponse,
  IUserOrgRelationship,
  IUserWithOrgType,
} from "../types";
import { IUser } from "@esri/arcgis-rest-types";
import { getProp } from "../../objects/get-prop";
import {
  ArcGISRequestError,
  IAuthenticationManager,
} from "@esri/arcgis-rest-request";
import { IAddGroupUsersResult, addGroupUsers } from "@esri/arcgis-rest-portal";
import { emailOrgUsers } from "../emailOrgUsers";
import { autoAddUsers } from "../autoAddUsers";
import { inviteUsers } from "../inviteUsers";

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
 * Governs logic for automatically adding N users to a group.
 * Users are added as either a regular user OR as an administrator of the group
 * depending on the addUserAsGroupAdmin prop on the IAddOrInviteContext.
 * If there is an email object on the IAddOrInviteContext, then email notifications are sent.
 *
 * @export
 * @param {IAddOrInviteContext} context context object
 * @param {string} userType what type of user is it: org | world | community
 * @param {boolean} [shouldEmail=false] should the user be emailed?
 * @return {IAddOrInviteResponse} response object
 */
export async function processAutoAddUsers(
  context: IAddOrInviteContext,
  userType:
    | "world"
    | "org"
    | "community"
    | "partnered"
    | "collaborationCoordinator",
  shouldEmail: boolean = false
): Promise<IAddOrInviteResponse> {
  // fetch users out of context object
  const users: IUser[] = getProp(context, userType);
  let autoAddResponse;
  let emailResponse;
  let notAdded: string[] = [];
  let errors: ArcGISRequestError[] = [];
  // fetch addUserAsGroupAdmin out of context
  const { addUserAsGroupAdmin } = context;

  if (addUserAsGroupAdmin) {
    // if is core group we elevate user to admin
    autoAddResponse = await autoAddUsersAsAdmins(
      getProp(context, "groupId"),
      users,
      getProp(context, "primaryRO")
    );
  } else {
    // if not then we are just auto adding them
    autoAddResponse = await autoAddUsers(
      getProp(context, "groupId"),
      users,
      getProp(context, "primaryRO")
    );
  }
  // handle notAdded users
  if (autoAddResponse.notAdded) {
    notAdded = notAdded.concat(autoAddResponse.notAdded);
  }
  // Merge errors into empty array
  if (autoAddResponse.errors) {
    errors = errors.concat(autoAddResponse.errors);
  }
  // run email process
  if (shouldEmail) {
    emailResponse = await processEmailUsers(context);
    // merge errors in to overall errors array to keep things flat
    if (emailResponse.errors && emailResponse.errors.length > 0) {
      errors = errors.concat(emailResponse.errors);
    }
  }
  // if you leave out any of the props
  // from the final object and you are concatting together arrays you can concat
  // an undeifined inside an array which will throw off array lengths.
  return {
    users: users.map((u) => u.username),
    notAdded,
    errors,
    notEmailed: emailResponse?.notEmailed || [],
    notInvited: [],
  };
}

/**
 * @private
 * Governs the logic for emailing N users. It acts under the assumption
 * that all the 'community' users are the ones being emailed (this is due to platform rules we conform to)
 * Function is called upstream depending on if an email object is attached to the context.
 * Email object contains its own auth as it'll require the community admin to send the email itself.
 * An individual email call goes out for each user due to how the response of multiple users in a single call works.
 *
 * @export
 * @param {IAddOrInviteContext} context context object
 * @return {IAddOrInviteResponse} response object
 */
export async function processEmailUsers(
  context: IAddOrInviteContext
): Promise<IAddOrInviteResponse> {
  // Fetch users out of context. We only email community users so we are
  // explicit about that
  const users: IUser[] = getProp(context, "community");
  const notEmailed: string[] = [];
  let errors: ArcGISRequestError[] = [];
  // iterate through users as we want a distinct email call per user due to how
  // batch email will only respond with success: true/false
  // and if there is an error then it gets priority even though successes do still go through
  for (const user of users) {
    // Make email call...
    const emailResponse = await emailOrgUsers(
      [user],
      getProp(context, "email.message"),
      getProp(context, "email.auth"),
      true
    );
    // If it's just a failed email
    // then add username to notEmailed array
    if (!emailResponse.success) {
      notEmailed.push(user.username);
      // If there was a legit error
      // Then only the error returns from
      // online. Add error AND include username in notEmailed array.
      if (emailResponse.errors) {
        errors = errors.concat(emailResponse.errors);
      }
    }
  }
  // if you leave out any of the props
  // from the final object and you are concatting together arrays you can concat
  // an undeifined inside an array which will throw off array lengths.
  return {
    users: users.map((u) => u.username),
    notEmailed,
    errors,
    notInvited: [],
    notAdded: [],
  };
}

/**
 * @private
 * Governs the logic for inviting N users to a single group.
 * An individual invite call goes out for each user and the results are consolidated.
 * See comment in function about the for...of loop which explains reasoning.
 *
 * @export
 * @param {IAddOrInviteContext} context context object
 * @param {string} userType what type of user is it: org | world | community
 * @return {IAddOrInviteResponse} response object
 */
export async function processInviteUsers(
  context: IAddOrInviteContext,
  userType: "world" | "org" | "community" | "partnered"
): Promise<IAddOrInviteResponse> {
  // Fetch users out of context based on userType
  const users: IUser[] = getProp(context, userType);
  const notInvited: string[] = [];
  let errors: ArcGISRequestError[] = [];
  const { addUserAsGroupAdmin } = context;
  // iterate through users as we want a distinct invite call per user due to how
  // batch invites will only respond with success: true/false
  // and if there is an error then it gets priority even though successes do still go through
  for (const user of users) {
    // Invite users call
    const inviteResponse = await inviteUsers(
      getProp(context, "groupId"),
      [user],
      getProp(context, "primaryRO"),
      20160, // timeout
      addUserAsGroupAdmin ? "group_admin" : "group_member" // if we are in a core group we want to invite them as a group admin, otherwise a group member
    );
    // If it's just a failed invite then
    // add username to notInvited array
    if (!inviteResponse.success) {
      notInvited.push(user.username);
      // If there was a legit error
      // Then only the error returns from
      // online. Add error AND include username in notInvited array.
      if (inviteResponse.errors) {
        errors = errors.concat(inviteResponse.errors);
      }
    }
  }
  // if you leave out any of the props
  // from the final object and you are concatting together arrays you can concat
  // an undeifined inside an array which will throw off array lengths.
  return {
    users: users.map((u) => u.username),
    notInvited,
    errors,
    notEmailed: [],
    notAdded: [],
  };
}

// Add/invite functions

/**
 * @private
 * Auto add N users to a single group, with users added as admins of that group
 *
 * @export
 * @param {string} id Group ID
 * @param {IUser[]} admins array of users to add to group as admin
 * @param {IAuthenticationManager} authentication authentication manager
 * @return {IAddGroupUsersResult} Result of the transaction (null if no users are passed in)
 */
export function autoAddUsersAsAdmins(
  id: string,
  admins: IUser[],
  authentication: IAuthenticationManager
): Promise<IAddGroupUsersResult> {
  let response = Promise.resolve(null);
  if (admins.length) {
    const args = {
      id,
      admins: admins.map((a) => a.username),
      authentication,
    };
    response = addGroupUsers(args);
  }
  return response;
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
