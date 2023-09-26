import {
  IAddGroupUsersResult,
  IInviteGroupUsersResult,
} from "@esri/arcgis-rest-portal";
import {
  ArcGISRequestError,
  IAuthenticationManager,
} from "@esri/arcgis-rest-request";
import { IUser } from "@esri/arcgis-rest-types";

export interface IEmail {
  subject?: string;
  body?: string;
  copyMe?: boolean;
}
/**
 * User object returned from add users modal in ember application
 * It extends the IUser interface with an additional property
 * that denotes what org relationship the user might have (world|org|community|partnered|collaborationCoordinator)
 */
export interface IUserWithOrgType extends IUser {
  orgType:
    | "world"
    | "org"
    | "community"
    | "partnered"
    | "collaborationCoordinator";
}

/**
 * User org relationship interface
 * Object contains users parsed by their org relationship (world|org|community|partnered|collaborationCoordinator)
 */
export interface IUserOrgRelationship {
  world: IUserWithOrgType[];
  org: IUserWithOrgType[];
  community: IUserWithOrgType[];
  partnered: IUserWithOrgType[];
  collaborationCoordinator: IUserWithOrgType[];
}

/**
 * Interface governing the add or invite response out of process auto add / invite / emailing users
 */
export interface IAddOrInviteResponse {
  users: string[];
  errors: ArcGISRequestError[];
  notAdded: string[];
  notInvited: string[];
  notEmailed: string[];
}

/**
 * Email input object for add/invite flow
 * contains both the IEmail object and auth for the email.
 */
export interface IAddOrInviteEmail {
  message: IEmail;
  auth: IAuthenticationManager;
  groupId?: string;
}

/**
 * Add or invite flow context - object that contains all the needed
 * inputs for org/world/community users
 */
export interface IAddOrInviteContext extends IUserOrgRelationship {
  groupId: string;
  primaryRO: IAuthenticationManager;
  allUsers: IUserWithOrgType[];
  canAutoAddUser: boolean;
  addUserAsGroupAdmin: boolean;
  email: IAddOrInviteEmail;
}

/**
 * Interface for result object out of addOrInviteUsersToGroup.
 */
export interface IAddOrInviteToGroupResult {
  errors: ArcGISRequestError[];
  notAdded: string[];
  notInvited: string[];
  notEmailed: string[];
  community: IAddOrInviteResponse;
  org: IAddOrInviteResponse;
  world: IAddOrInviteResponse;
  partnered: IAddOrInviteResponse;
  collaborationCoordinator: IAddOrInviteResponse;
  groupId: string;
}

/**
 * Interface for result object out of addGroupMembers.
 */
export interface IAddGroupMembersResult {
  added: string[];
  invited: string[];
  notAdded: string[];
  notInvited: string[];
  responses: IAddOrInviteMemberResponse[];
}

export interface IAddOrInviteMemberResponse {
  username: string;
  add: IAddGroupUsersResult;
  invite: IInviteGroupUsersResult;
}
