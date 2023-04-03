import { IItem, IUser } from "@esri/arcgis-rest-portal";

/**
 * Determines the correct orgId for an item.
 * Note: it's undocumented, but the portal API will return orgId for items... sometimes.
 *
 * @param item
 * @param ownerUser item owner's hydrated user object
 */
export function getItemOrgId(item: IItem, ownerUser?: IUser) {
  return item.orgId || ownerUser?.orgId;
}
