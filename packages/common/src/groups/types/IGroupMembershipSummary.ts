import { IUser } from "@esri/arcgis-rest-portal";

export interface IGroupMembershipSummary {
  total: number;
  users: Array<IUser>;
}
