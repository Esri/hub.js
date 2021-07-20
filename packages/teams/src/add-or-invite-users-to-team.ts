import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import {
  IAddOrInviteContext,
  IAddOrInviteEmail,
  IAddOrInviteToTeamResult,
  IUserModalObject,
  IUserOrgRelationship,
} from "./types";
import {
  addOrInviteCommunityUsers,
  addOrInviteOrgUsers,
  addOrInviteWorldUsers,
  groupUsersByOrgRelationship,
} from "./utils";

export async function addOrInviteUsersToTeam(
  groupId: string,
  users: IUserModalObject[],
  primaryRO: IAuthenticationManager,
  canAutoAddUser: boolean,
  asAdmin: boolean,
  email: IAddOrInviteEmail
): Promise<IAddOrInviteToTeamResult> {
  // Group users by their org relationship
  const parsedUsers: IUserOrgRelationship = groupUsersByOrgRelationship(users);
  // build up params
  const inputParams = {
    groupId, // needed for all the things
    primaryRO, // also needed for all the requests
    allUsers: users, // all users
    canAutoAddUser, // can the user be auto added rather than invited
    asAdmin, // Should they be elevated to admin...
    email, // either email message / auth obj or undefined
  };
  // create context from params and parsed users
  const context: IAddOrInviteContext = Object.assign(inputParams, parsedUsers);
  // result obj by org relationship
  const result: IAddOrInviteToTeamResult = {
    community: await addOrInviteCommunityUsers(context),
    org: await addOrInviteOrgUsers(context),
    world: await addOrInviteWorldUsers(context),
    notAdded: [],
    notInvited: [],
    notEmailed: [],
    errors: [],
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
