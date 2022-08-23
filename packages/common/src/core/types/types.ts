/**
 * Access levels that can be set on an item
 */
export type SettableAccessLevel = "public" | "org" | "private";

/**
 * Access level for Platform Entities
 */
export type AccessLevel = SettableAccessLevel | "shared";
