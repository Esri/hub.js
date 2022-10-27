import { IPagingParams } from "@esri/arcgis-rest-types";
import {
  ChannelFilter,
  IAclPermissionDefinition,
  IChannelAclDefinition,
  IDiscussionsRequestOptions,
  IWithAuthor,
  IWithChannelSettings,
  IWithEditor,
  IWithFiltering,
  IWithPlatformSharing,
  IWithSorting,
  IWithTimeQueries,
  IWithTimestamps,
  SharingAccess,
} from "../types";

/**
 * Channel sorting fields
 *
 * @enum {string}
 */
export enum ChannelSort {
  ACCESS = "access",
  CREATED_AT = "createdAt",
  CREATOR = "creator",
  EDITOR = "editor",
  ID = "id",
  LAST_ACTIVITY = "last_activity",
  UPDATED_AT = "updatedAt",
}

/**
 * relations of channel entity
 *
 * @export
 * @enum {string}
 */
export enum ChannelRelation {
  SETTINGS = "settings",
}

/**
 * permission object that will populate ACL interface
 *
 * @export
 * @interface IAclPermission
 */
export interface IAclPermission
  extends Omit<IAclPermissionDefinition, "accesibleAfter">,
    IWithTimestamps {
  accessibleAfter: string;
}

/**
 * ACL intra-group/org roles
 *
 * @export
 * @interface IAclGroup
 */
export interface IAclGroup {
  admin?: IAclPermission;
  member?: IAclPermission;
}

/**
 * key-value lookup for ACL group/org permission definitions
 * @export
 */
export type AclGroupMap = Record<string, IAclGroup>;

/**
 * key-value lookup for ACL user permissions
 * @export
 */
export type AclUserMap = Record<string, IAclPermission>;

/**
 * channel access control list
 *
 * @export
 * @interface IChannelAcl
 */
export interface IChannelAcl {
  anonymous?: IAclPermission;
  authenticated?: IAclPermission;
  groups?: AclGroupMap;
  orgs?: AclGroupMap;
  users: AclUserMap;
}

/**
 * parameters/options for creating a channel
 *
 * @export
 * @interface ICreateChannel
 * @extends {IWithChannelSettings}
 * @extends {IWithPlatformSharing}
 */
export interface ICreateChannel
  extends Partial<IWithChannelSettings>,
    IWithPlatformSharing {
  acl?: IChannelAclDefinition;
}

/**
 * dto for decorating found channel with relations
 *
 * @export
 * @interface IFetchChannel
 */
export interface IFetchChannel {
  relations?: ChannelRelation[];
}

/**
 * dto for querying channels
 *
 * @export
 * @interface ISearchChannels
 * @extends {Partial<IPagingParams>}
 * @extends {Partial<IWithSorting<ChannelSort>>}
 * @extends {Partial<IWithTimeQueries>}
 */
export interface ISearchChannels
  extends Partial<IPagingParams>,
    Partial<IWithSorting<ChannelSort>>,
    Partial<IWithTimeQueries>,
    Partial<IWithFiltering<ChannelFilter>> {
  groups?: string[];
  access?: SharingAccess[];
  relations?: ChannelRelation[];
}

/**
 * dto for updating channel settings
 *
 * @export
 * @interface IUpdateChannel
 * @extends {Partial<IWithSettings>}
 * @extends {Partial<IWithAuthor>}
 */
export interface IUpdateChannel
  extends Partial<IWithChannelSettings>,
    Partial<IWithAuthor> {}

/**
 * request params for creating a channel
 *
 * @export
 * @interface ICreateChannelParams
 * @extends {IHubRequestOptions}
 */
export interface ICreateChannelParams extends IDiscussionsRequestOptions {
  data: ICreateChannel;
}

/**
 * request params for getting a channel
 *
 * @export
 * @interface IFetchChannelParams
 * @extends {IHubRequestOptions}
 */
export interface IFetchChannelParams extends IDiscussionsRequestOptions {
  channelId: string;
  data?: IFetchChannel;
}

/**
 * request params for searching channels
 *
 * @export
 * @interface ISearchChannelsParams
 * @extends {IHubRequestOptions}
 */
export interface ISearchChannelsParams extends IDiscussionsRequestOptions {
  data?: ISearchChannels;
}
/**
 * request params for updating a channel's settings
 *
 * @export
 * @interface IUpdateChannelParams
 * @extends {IHubRequestOptions}
 */
export interface IUpdateChannelParams extends IDiscussionsRequestOptions {
  channelId: string;
  data: IUpdateChannel;
}

/**
 * request params for deleting a channel
 *
 * @export
 * @interface IRemoveChannelParams
 * @extends {IHubRequestOptions}
 */
export interface IRemoveChannelParams extends IDiscussionsRequestOptions {
  channelId: string;
}

/**
 * delete channel response properties
 *
 * @export
 * @interface IRemoveChannelResponse
 */
export interface IRemoveChannelResponse {
  success: boolean;
  channelId: string;
}

/**
 * request params for fetching opt out status
 *
 * @export
 * @interface IFetchChannelNotificationOptOutParams
 * @extends {IHubRequestOptions}
 */
export interface IFetchChannelNotificationOptOutParams
  extends IDiscussionsRequestOptions {
  channelId: string;
}

/**
 * request params for opting out
 *
 * @export
 * @interface ICreateChannelNotificationOptOutParams
 * @extends {IHubRequestOptions}
 */
export interface ICreateChannelNotificationOptOutParams
  extends IDiscussionsRequestOptions {
  channelId: string;
}

/**
 * request params for opting back in
 *
 * @export
 * @interface IRemoveChannelNotificationOptOutParams
 * @extends {IHubRequestOptions}
 */
export interface IRemoveChannelNotificationOptOutParams
  extends IDiscussionsRequestOptions {
  channelId: string;
}

/**
 * request params for deleting channel activity
 *
 * @export
 * @interface IRemoveChannelActivityParams
 * @extends {IHubRequestOptions}
 */
export interface IRemoveChannelActivityParams
  extends IDiscussionsRequestOptions {
  channelId: string;
}

/**
 * representation of channel entity
 *
 * @export
 * @interface IChannel
 * @extends {IWithSettings}
 * @extends {IWithSharing}
 * @extends {IWithAuthor}
 * @extends {IWithEditor}
 * @extends {IWithTimestamps}
 */
export interface IChannel
  extends IWithChannelSettings,
    IWithPlatformSharing,
    IWithAuthor,
    IWithEditor,
    IWithTimestamps {
  id: string;
  acl: IChannelAcl;
}
