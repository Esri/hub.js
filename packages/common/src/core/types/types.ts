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

/**
 * Where did the location come from originally?
 * This is used in the location picker component to determine
 * what source was used. The values are used in IHubLocation.type.
 * Please note that adding more values will require changes in the location picker
 */
export type IHubLocationType = "none" | "custom" | "org" | "item";
