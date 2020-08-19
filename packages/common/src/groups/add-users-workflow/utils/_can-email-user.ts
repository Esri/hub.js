import { IUser } from "@esri/arcgis-rest-auth";

/**
 * @private
 */
export function _canEmailUser(recipient: IUser, sender: IUser): boolean {
  return recipient.orgId === sender.orgId;
}
