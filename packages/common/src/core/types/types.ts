/**
 * Access levels that can be set on an entity
 */
export type SettableAccessLevel = "public" | "org" | "private";

/**
 * Access level for Platform Entities
 */
export type AccessLevel = SettableAccessLevel | "shared";

/**
 * Key value pair of IModel resource to resource filename.
 * (used for fetching/creating resources)
 */
export const EntityResourceMap: {
  [key: string]: string;
} = {
  location: "location.json",
};

/**
 * Where did the location come from originally?
 * This is used in the location picker component to determine
 * what source was used. The values are used in IHubLocation.type.
 * Please note that adding more values will require changes in the location picker
 */
export type IHubLocationType = "none" | "custom" | "org" | "item";

/**
 * Sort field for Hub Groups
 */
export type GroupSortField =
  | "title"
  | "owner"
  | "avgrating"
  | "numviews"
  | "created"
  | "modified";

/**
 * Member type for Hub Groups
 */
export type MemberType = "owner" | "admin" | "member" | "none";

/**
 * ArcGIS sort orders
 */
export type SortOrder = "asc" | "desc";

/**
 * Who can join the groups
 * organization: members of the group's org only
 * collaborators: members of the group's org and its partner orgs
 * anyone: members of any orgs
 */
export type MembershipAccess = "organization" | "collaborators" | "anyone";
