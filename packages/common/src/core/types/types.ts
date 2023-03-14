/**
 * Access levels that can be set on an item
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

export type IHubLocationType = "none" | "custom" | "default" | "org-extent";
