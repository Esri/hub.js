import {
  ArcGISRequestError,
  IAuthenticationManager,
} from "@esri/arcgis-rest-request";
import { addOrInviteUsersToTeam } from "./add-or-invite-users-to-team";
import {
  IAddOrInviteEmail,
  IAddOrInviteToTeamResult,
  IUserModalObject,
} from "./types";

export async function addOrInviteUsersToTeams(
  groupIds: string[],
  users: IUserModalObject[],
  primaryRO: IAuthenticationManager,
  canAutoAddUser: boolean = false,
  asAdmin: boolean = false,
  email?: IAddOrInviteEmail
): Promise<{
  notAdded: string[];
  notInvited: string[];
  notEmailed: string[];
  errors: ArcGISRequestError[];
  responses: IAddOrInviteToTeamResult[];
}> {
  // accumulator object
  let notAdded: string[] = [];
  let notInvited: string[] = [];
  let notEmailed: string[] = [];
  let errors: ArcGISRequestError[] = [];
  const responses: IAddOrInviteToTeamResult[] = [];
  // need to for..of loop this as a reduce will overwrite promises during execution
  // this way we get an object of each group id nicely.
  for (const groupId of groupIds) {
    const result = await addOrInviteUsersToTeam(
      groupId,
      users,
      primaryRO,
      canAutoAddUser,
      asAdmin,
      email
    );
    // attach each groups results
    responses.push(result);
    // surface results to the top of the stack...
    notAdded = notAdded.concat(result.notAdded);
    errors = errors.concat(result.errors);
    notInvited = notInvited.concat(result.notInvited);
    notEmailed = notEmailed.concat(result.notEmailed);
  }
  return {
    notAdded,
    notInvited,
    notEmailed,
    errors,
    responses,
  };
}
