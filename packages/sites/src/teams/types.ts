import { IGroup } from "@esri/arcgis-rest-types";
import { TEAMTYPES } from "./team-types";

export type AGOAccess = "public" | "org" | "private";

export type HubProduct = "basic" | "premium" | "portal";

// This type just says that whatever string is used as a
// TeamType must exist in TEAMTYPES
export type HubTeamType = typeof TEAMTYPES[number];

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
  };
}
