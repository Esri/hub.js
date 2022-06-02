import { IUser } from "@esri/arcgis-rest-portal";

/**
 * Structure of the `membershipSummary` Group enrichment
 */
export interface IGroupMembershipSummary {
  /**
   * Total number of members
   */
  total: number;
  /**
   * Up to three group members. Used
   * to display subset of avatars in cards.
   */
  users: IUser[];
}
