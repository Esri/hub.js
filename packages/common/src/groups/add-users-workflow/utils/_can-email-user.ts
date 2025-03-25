import type { IUser } from "@esri/arcgis-rest-portal";

/**
 * @private
 *
 * returns whether or not the users are in the same org
 */
export function _canEmailUser(recipient: IUser, sender: IUser): boolean {
  return recipient.orgId === sender.orgId;
}
