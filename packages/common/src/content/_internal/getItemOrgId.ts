import { IItem, IUser } from "@esri/arcgis-rest-portal";

export function getItemOrgId(item: IItem, ownerUser?: IUser) {
  return item.orgId || ownerUser?.orgId;
}
