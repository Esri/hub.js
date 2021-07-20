import {
  ArcGISRequestError,
  IAuthenticationManager,
} from "@esri/arcgis-rest-request";
import { IGroup, IUser } from "@esri/arcgis-rest-types";
import { IEmail } from "@esri/hub-common";

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

/**
 * privPropValues template
 * Used if we want to conditionally change values
 * in a template.
 */
export interface IPrivPropValues {
  priv: string;
  prop: string;
  value: string;
}

export interface ITeamStatus {
  id: string;
  isOk: boolean;
  isMissing: boolean;
  isBroken: boolean;
  canFix: boolean;
  isMember: boolean;
}

export interface ITeamsStatus {
  core: ITeamStatus;
  content: ITeamStatus;
  followers: ITeamStatus;
}

export interface IUserModalObject extends IUser {
  modelType?: string;
}

export interface IUserOrgRelationship {
  world: IUserModalObject[];
  org: IUserModalObject[];
  community: IUserModalObject[];
  // partnered: IUserModalObject[]
}

export interface IAddOrInviteResponse {
  users: string[];
  errors: ArcGISRequestError[];
  notAdded: string[];
  notInvited: string[];
  notEmailed: string[];
}

export interface IAddOrInviteEmail {
  message: IEmail;
  auth: IAuthenticationManager;
}

export interface IAddOrInviteContext extends IUserOrgRelationship {
  groupId: string;
  primaryRO: IAuthenticationManager;
  allUsers: IUserModalObject[];
  canAutoAddUser: boolean;
  asAdmin: boolean;
  email: IAddOrInviteEmail;
}

export interface IAddOrInviteToTeamResult {
  errors: ArcGISRequestError[];
  notAdded: string[];
  notInvited: string[];
  notEmailed: string[];
  community: IAddOrInviteResponse;
  org: IAddOrInviteResponse;
  world: IAddOrInviteResponse;
}

/**
 * Enum of the types of teams that the teams service supports
 */
export const TEAMTYPES = [
  "core",
  "content",
  "followers",
  "team",
  "event",
] as const;
