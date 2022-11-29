import { Permission } from "./Permission";

/**
 * Association of a Permission with a set of collaborators
 */
export interface IEntityPermissionPolicy {
  /**
   * Permission being granted
   */
  permission: Permission;
  /**
   * Type of the collaboration - org, group, group-admin or user
   */
  collaborationType: CollaborationType;
  /**
   * Id of the collaboration set
   */
  collaborationId: string;
}

/**
 * Type of collaboration set. Used when associating a permission with a set of collaborators
 */
export type CollaborationType = "user" | "group" | "group-admin" | "org";
