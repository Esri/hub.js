import {
  IAddGroupUsersResult,
  IInviteGroupUsersResult,
} from "@esri/arcgis-rest-portal";

export interface IEmail {
  subject?: string;
  body?: string;
  copyMe?: boolean;
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
