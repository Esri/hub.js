import { IUser } from "@esri/arcgis-rest-auth";
import {
  addUsersToGroup,
  IConsolidatedResult,
  IEmail,
  IHubRequestOptions
} from "@esri/hub-common";

/**
 * Attempts to add, invite, or email users about attending an event
 * depending on the requesting user's permissions (see addUsersToGroup in hub-common)
 *
 * TODO: Add interfaces
 *
 * @param {string} eventId
 * @param {object[]} usersToAdd
 * @param {object} primaryRO Info and authentication for the requesting user
 * @param {object} email Email to be sent (if qualifying users are passed in)
 * @param {object} secondaryRO Info and authentication for emailing members of a secondary organization (typically a community org)
 *
 * @returns {object} The operations attempted, whether they were successful and any errors
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
