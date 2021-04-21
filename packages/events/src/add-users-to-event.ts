import { IUser } from "@esri/arcgis-rest-auth";
import { IHubRequestOptions } from "@esri/hub-common";

import { addUsersToGroup, IConsolidatedResult, IEmail } from "@esri/hub-teams";
/**
 * Attempts to add, invite, or email users about attending an event
 * depending on the requesting user's permissions (see addUsersToGroup in hub-common)
 *
 * @param {string} eventId
 * @param {IUser[]} usersToAdd
 * @param {IHubRequestOptions} primaryRO Info and authentication for the requesting user
 * @param {IEmail} [email] Email to be sent (if qualifying users are passed in)
 * @param {IHubRequestOptions} [secondaryRO] Info and authentication for emailing members of a secondary organization (typically a community org)
 *
 * @returns {IConsolidatedResult} The operations attempted, whether they were successful and any errors
 */
export function addUsersToEvent(
  eventId: string,
  usersToAdd: IUser[],
  primaryRO: IHubRequestOptions,
  email?: IEmail,
  secondaryRO?: IHubRequestOptions
): Promise<IConsolidatedResult> {
  return addUsersToGroup(eventId, usersToAdd, primaryRO, email, secondaryRO);
}
