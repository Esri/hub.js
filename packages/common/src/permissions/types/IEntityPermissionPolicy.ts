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
  collaborationId?: string | null;
  /**
   * Id of the permission record
   */
  id?: string | null;
}

/**
 * Type of collaboration set. Used when associating a permission with a set of collaborators
 */
export type CollaborationType =
  | "user"
  | "group"
  | "group-admin"
  | "org"
  | "org-admin"
  | "authenticated"
  | "anonymous"
  | "owner";

/**
 * A map of supported collaboration set types
 */
export const COLLABORATION_TYPES: Record<
  | "user"
  | "group"
  | "groupAdmin"
  | "org"
  | "orgAdmin"
  | "authenticated"
  | "anonymous"
  | "owner",
  CollaborationType
> = {
  user: "user",
  group: "group",
  groupAdmin: "group-admin",
  org: "org",
  orgAdmin: "org-admin",
  authenticated: "authenticated",
  anonymous: "anonymous",
  owner: "owner",
};
