import { IPagingParams } from "@esri/arcgis-rest-types";
import {
  ChannelFilter,
  IDiscussionsRequestOptions,
  IWithAuthor,
  IWithEditor,
  IWithFiltering,
  IWithSorting,
  IWithTimeQueries,
  IWithTimestamps,
  PostReaction,
  PostStatus,
  Role,
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
 * @interface IAclPermissionDefinition
 */
export interface IAclPermissionDefinition {
  role: Role;
  accessibleAfter?: string;
}

/**
 * ACL intra-group/org role definition
 *
 * @export
 * @interface IAclGroupDefinition
 */
export interface IAclGroupDefinition {
  admin?: IAclPermissionDefinition;
  member?: IAclPermissionDefinition;
}

/**
 * key-value lookup for ACL group/org permission definitions
 * @export
 */
export type AclGroupDefinitionMap = Record<string, IAclGroupDefinition>;

/**
 * key-value lookup for ACL user permission definitions
 * @export
 */
export type AclUserDefinitionMap = Record<string, IAclPermissionDefinition>;

/**
 * request options for creating channel with ACL
 *
 * @export
 * @interface IChannelAclDefinition
 */
export interface IChannelAclDefinition {
  anonymous?: IAclPermissionDefinition;
  authenticated?: IAclPermissionDefinition;
  groups?: AclGroupDefinitionMap;
  orgs?: AclGroupDefinitionMap;
  users?: {
    [key: string]: IAclPermissionDefinition;
  };
}
/**
 * permission object that will populate ACL interface
 *
 * @export
 * @interface IAclPermission
 * @extends {Omit<IAclPermissionDefinition, "accessibleAfter">}
 */
export interface IAclPermission
  extends Omit<IAclPermissionDefinition, "accessibleAfter">,
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
 * @interface ICreateChannelSettings
 */
export interface ICreateChannelSettings {
  allowReply?: boolean;
  allowAnonymous?: boolean;
  softDelete?: boolean;
  defaultPostStatus?: PostStatus;
  allowReaction?: boolean;
  name?: string;
  allowedReactions?: PostReaction[];
  blockwords?: string[];
}

/**
 * parameters/options for creating a channel
 *
 * @export
 * @interface ICreateChannelPermissions
 */
export interface ICreateChannelPermissions {
  access?: SharingAccess;
  groups?: string[];
  orgs?: string[];
  acl?: IChannelAclDefinition;
}

/**
 * parameters/options for creating a channel
 *
 * @export
 * @interface ICreateChannel
 * @extends {ICreateChannelSettings}
 */
export interface ICreateChannel
  extends ICreateChannelSettings,
    ICreateChannelPermissions {}

/**
 * representation of channel entity
 *
 * @export
 * @interface IChannel
 * @extends {Required<Omit<ICreateChannel, 'acl'>>}
 * @extends {IWithAuthor}
 * @extends {IWithEditor}
 * @extends {IWithTimestamps}
 */
export interface IChannel
  extends Required<Omit<ICreateChannel, "acl">>,
    IWithAuthor,
    IWithEditor,
    IWithTimestamps {
  id: string;
  acl: IChannelAcl;
}

/**
 * parameters/options for updating channel settings
 *
 * @export
 * @interface IUpdateChannel
 * @extends {ICreateChannelSettings}
 * @extends {Partial<IWithAuthor>}
 */
export interface IUpdateChannel
  extends ICreateChannelSettings,
    Partial<IWithAuthor> {}

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
 * @extends {Partial<IWithFiltering<ChannelFilter>>}
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
 * request params for creating a channel
 *
 * @export
 * @interface ICreateChannelParams
 * @extends {IDiscussionsRequestOptions}
 */
export interface ICreateChannelParams extends IDiscussionsRequestOptions {
  data: ICreateChannel;
}

/**
 * request params for getting a channel
 *
 * @export
 * @interface IFetchChannelParams
 * @extends {IDiscussionsRequestOptions}
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
 * @extends {IDiscussionsRequestOptions}
 */
export interface ISearchChannelsParams extends IDiscussionsRequestOptions {
  data?: ISearchChannels;
}
/**
 * request params for updating a channel's settings
 *
 * @export
 * @interface IUpdateChannelParams
 * @extends {IDiscussionsRequestOptions}
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
 * @extends {IDiscussionsRequestOptions}
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
 * @extends {IDiscussionsRequestOptions}
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
 * @extends {IDiscussionsRequestOptions}
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
 * @extends {IDiscussionsRequestOptions}
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
 * @extends {IDiscussionsRequestOptions}
 */
export interface IRemoveChannelActivityParams
  extends IDiscussionsRequestOptions {
  channelId: string;
}
