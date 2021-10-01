import { IUser } from "@esri/arcgis-rest-auth";
import {
  addUsersToGroup,
  IConsolidatedResult,
  IEmail,
  IHubRequestOptions,
} from "../";

/**
 * Attempts to Add, Invite, or email users about joining
 * a team depending on the requesting user's permissions
 * (see addUsersToGroup in hub-common)
 *
 * @param {string} groupId
 * @param {IUser[]} usersToAdd
 * @param {IHubRequestOptions} primaryRO Info and authentication for the requesting user
 * @param {IEmail} [email] Email to be sent (if qualifying users are passed in)
 * @param {IHubRequestOptions} [secondaryRO] Info and authentication for emailing members of a secondary organization (typically a community org)
 *
 * @returns {IConsolidatedResult} The operations attempted, whether they were successful and any errors
 */
export function addUsersToTeam(
  teamId: string,
  usersToAdd: IUser[],
  primaryRO: IHubRequestOptions,
  email?: IEmail,
  secondaryRO?: IHubRequestOptions
): Promise<IConsolidatedResult> {
  return addUsersToGroup(teamId, usersToAdd, primaryRO, email, secondaryRO);
}
