import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import {
  IAddOrInviteContext,
  IAddOrInviteEmail,
  IAddOrInviteToGroupResult,
  IUserOrgRelationship,
  IUserWithOrgType,
} from "../types";
import {
  addOrInviteCollaborationCoordinators,
  addOrInviteCommunityUsers,
  addOrInviteOrgUsers,
  addOrInvitePartneredUsers,
  addOrInviteWorldUsers,
  groupUsersByOrgRelationship,
} from "./AddOrInviteUsersToGroupUtils";

/**
 * Add or invite N users to a single group
 * Org|community|world logic flows are run even if there are no users applicable for that particular path.
 * Results from each path are consolidated and surfaced in the return object as failures and errors are of
 * more importance than successes.
 *
 * @export
 * @param {string} groupId Group we are adding users to
 * @param {IUserWithOrgType[]} users array of users to add
 * @param {IAuthenticationManager} primaryRO primary requestOptions
 * @param {boolean} canAutoAddUser Can we automatically add a user to the group?
 * @param {boolean} addUserAsGroupAdmin Should the user be added as a group administrator
 * @param {IAddOrInviteEmail} email Email object
 * @return {IAddOrInviteToGroupResult} Result object
 */
export async function addOrInviteUsersToGroup(
  groupId: string,
  users: IUserWithOrgType[],
  primaryRO: IAuthenticationManager,
  canAutoAddUser: boolean,
  addUserAsGroupAdmin: boolean,
  email: IAddOrInviteEmail
): Promise<IAddOrInviteToGroupResult> {
  // Group users by their org relationship
  const parsedUsers: IUserOrgRelationship = groupUsersByOrgRelationship(users);
  // build up params for the context
  const inputParams = {
    groupId, // The group ID that the users shall be added/invited to.
    primaryRO, // requestOptions required to auth for all the various add/invite logic except email
    allUsers: users, // All users.
    canAutoAddUser, // can the user be automatically added to the group rather than just invited?
    addUserAsGroupAdmin, // Should they be added to the group as a group Admin vs a normal group member
    email, // Either undefined or an object that contains both message/subject of the email and the auth for the email request
  };
  // create context from params and parsed users
  const context: IAddOrInviteContext = Object.assign(inputParams, parsedUsers);
  // result obj by org relationship
  const result: IAddOrInviteToGroupResult = {
    community: await addOrInviteCommunityUsers(context),
    org: await addOrInviteOrgUsers(context),
    world: await addOrInviteWorldUsers(context),
    partnered: await addOrInvitePartneredUsers(context),
    collaborationCoordinator: await addOrInviteCollaborationCoordinators(
      context
    ),
    notAdded: [],
    notInvited: [],
    notEmailed: [],
    errors: [],
    groupId,
  };
  // Bring not added / invited / emailed / errors up to the top level
  result.notAdded = [
    ...result.community.notAdded,
    ...result.org.notAdded,
    ...result.world.notAdded,
  ];
  result.notInvited = [
    ...result.community.notInvited,
    ...result.org.notInvited,
    ...result.world.notInvited,
  ];
  result.notEmailed = [
    ...result.community.notEmailed,
    ...result.org.notEmailed,
    ...result.world.notEmailed,
  ];
  result.errors = [
    ...result.community.errors,
    ...result.org.errors,
    ...result.world.errors,
  ];
  return result;
}
