import { IGroup } from "@esri/arcgis-rest-types";

export type AGOAccess = "public" | "org" | "private";

/**
 * Hub Product Enum
 * "basic" - Available to ArcGIS Online Organizations
 * "premium" - Available to Organizations who have purchsed Hub Premium
 * "portal" - Available to ArcGIS Enterprise users
 */
export type HubProduct = "basic" | "premium" | "portal";

// This type just says that whatever string is used as a
// TeamType must exist in TEAMTYPES
export type HubTeamType = typeof TEAMTYPES[number];

/**
 * Group Template
 * Used when creating Team Groups
 */
export interface IGroupTemplate extends Partial<IGroup> {
  config: {
    groupType: string;
    type: HubTeamType;
    availableIn: HubProduct[];
    propertyName?: string;
    requiredPrivs: string[];
    titleI18n: string;
    descriptionI18n: string;
    snippetI18n: string;
    privPropValues?: IPrivPropValues[];
  };
}

export interface IPrivPropValues {
  priv: string;
  prop: string;
  value: string;
}

/**
 * Enum of the types of teams that the teams service supports
 */
export const TEAMTYPES = [
  "core",
  "content",
  "followers",
  "team",
  "event"
] as const;
