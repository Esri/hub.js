import { IUser } from "@esri/arcgis-rest-auth";
import {
  ICreateOrgNotificationResult,
  ICreateOrgNotificationOptions,
  createOrgNotification,
} from "@esri/arcgis-rest-portal";
import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import { IEmail } from "./types";

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
): Promise<ICreateOrgNotificationResult | null> {
  let response: Promise<ICreateOrgNotificationResult | null> =
    Promise.resolve(null);
  if (users.length) {
    const args: ICreateOrgNotificationOptions = {
      authentication,
      message: email.body,
      subject: email.subject,
      notificationChannelType: "email",
      users: users.map((u) => u.username),
    };
    if (!isOrgAdmin) {
      args.batchSize = 1;
    }
    response = createOrgNotification(args);
  }

  return response;
}
