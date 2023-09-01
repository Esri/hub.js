import {
  ICreateOrgNotificationResult,
  IInviteGroupUsersResult,
  IUser,
} from "@esri/arcgis-rest-portal";
import { ArcGISRequestError } from "@esri/arcgis-rest-request";
import { IHubRequestOptions } from "../../types";
import { IEmail } from "../types";

export interface IConsolidatedResult {
  success: boolean;
  autoAdd?: ISimpleResult;
  invite?: IInviteGroupUsersResult;
  email?: ICreateOrgNotificationResult;
}

export interface ISimpleResult {
  success: boolean;
  errors?: ArcGISRequestError[];
}

export interface IAddMemberContext {
  groupId: string;
  allUsers: IUser[];
  primaryRO: IHubRequestOptions;
  requestingUser: IUser;
  usersToAutoAdd: IUser[];
  usersToInvite: IUser[];
  usersToEmail: IUser[];
  email?: IEmail;
  secondaryRO?: IHubRequestOptions;
  autoAddResult?: ISimpleResult;
  inviteResult?: IInviteGroupUsersResult;
  primaryEmailResult?: ICreateOrgNotificationResult;
  secondaryEmailResult?: ICreateOrgNotificationResult;
}
