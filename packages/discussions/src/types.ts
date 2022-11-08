import {
  IPagingParams,
  IPagedResponse as IRestPagedResponse,
  IUser,
} from "@esri/arcgis-rest-types";
import { IHubRequestOptions } from "@esri/hub-common";
import { Geometry } from "geojson";

/**
 * sort orders
 *
 * @export
 * @enum {string}
 */
export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

/**
 * reactions to posts
 *
 * @export
 * @enum {string}
 */
export enum PostReaction {
  THUMBS_UP = "thumbs_up",
  THUMBS_DOWN = "thumbs_down",
  THINKING = "thinking",
  HEART = "heart",
  ONE_HUNDRED = "one_hundred",
  SAD = "sad",
  LAUGH = "laugh",
  SURPRISED = "surprised",
}

/**
 * platform sharing access values
 *
 * @export
 * @enum {string}
 */
export enum SharingAccess {
  PUBLIC = "public",
  ORG = "org",
  PRIVATE = "private",
}
/**
 * representation of AGOL platform sharing ACL
 * NOTE: orgs is an array to enable future org-org sharing/discussion
 *
 * @export
 * @interface IPlatformSharing
 */
export interface IPlatformSharing {
  groups: string[];
  orgs: string[];
  access: SharingAccess;
}

/**
 * possible statuses of a post
 *
 * @export
 * @enum {string}
 */
export enum PostStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  DELETED = "deleted",
  HIDDEN = "hidden",
}

/**
 * possible discussionn content types, i.e. a post can be about an item, dataset, or group
 *
 * @export
 * @enum {string}
 */
export enum DiscussionType {
  GROUP = "group",
  CONTENT = "content",
}

/**
 * source of a post, i.e. app context
 *
 * @export
 * @enum {string}
 */
export enum DiscussionSource {
  HUB = "hub",
  AGO = "ago",
  URBAN = "urban",
}

/**
 * named parts of a discussion URI, follows this convention:
 * ${source}://${type}/${id}_${layer}?features=${...features}&attribute=${attribute}
 *
 * coarse-grained uri - hub://item/ab3 -- commenting from hub about item ab3
 * --
 * fine-grained uri - hub://dataset/3ef_0?features=10,32&attribute=species -- commenting from
 * hub about species attribute of features id 10 & 32 in dataset 3ef layer 0
 *
 * @export
 * @interface IDiscussionParams
 */
export interface IDiscussionParams {
  source: string | null;
  type: string | null;
  id: string | null;
  layer: string | null;
  features: string[] | null;
  attribute: string | null;
}

/**
 * relations of post entity
 *
 * @export
 * @enum {string}
 */
export enum PostRelation {
  REPLIES = "replies",
  REACTIONS = "reactions",
  PARENT = "parent",
  CHANNEL = "channel",
}

/**
 * relations of reaction entity
 *
 * @export
 * @enum {string}
 */
export enum ReactionRelation {
  POST = "post",
}

/**
 * filters of channel entity
 *
 * @export
 * @enum {string}
 */
export enum ChannelFilter {
  HAS_USER_POSTS = "has_user_posts",
}

// sorting

/**
 * Common sorting fields
 */
export enum CommonSort {
  CREATED_AT = "createdAt",
  CREATOR = "creator",
  EDITOR = "editor",
  ID = "id",
  UPDATED_AT = "updatedAt",
}

/**
 * creator property
 *
 * @export
 * @interface IWithAuthor
 */
export interface IWithAuthor {
  creator: string;
}

/**
 * editor property
 *
 * @export
 * @interface IWithEditor
 */
export interface IWithEditor {
  editor: string;
}

/**
 * sorting properties
 *
 * @export
 * @interface IWithSorting
 */
export interface IWithSorting<SortEnum> {
  sortBy: SortEnum;
  sortOrder: SortOrder;
}

/**
 * filtering properties
 *
 * @export
 * @interface IWithFiltering
 */
export interface IWithFiltering<FilterEnum> {
  filterBy: FilterEnum;
}

/**
 * properties that enable temporal querying
 *
 * @export
 * @interface IWithTimeQueries
 */
export interface IWithTimeQueries {
  createdBefore: Date;
  createdAfter: Date;
  updatedBefore: Date;
  updatedAfter: Date;
}

/**
 * temporal properties
 *
 * @export
 * @interface IWithTimestamps
 */
export interface IWithTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * paginated response properties
 *
 * @export
 * @interface IPagedResponse
 * @extends {IRestPagedResponse}
 * @template PaginationObject
 */
export interface IPagedResponse<PaginationObject> extends IRestPagedResponse {
  items: PaginationObject[];
}

/**
 * delete notifications opt out response properties
 *
 * @export
 * @interface IRemoveChannelNotificationOptOutResult
 */
export interface IRemoveChannelNotificationOptOutResult {
  success: boolean;
  channelId: string;
  username: string;
}

/**
 * delete channel activity response properties
 *
 * @export
 * @interface IRemoveChannelActivityResult
 */
export interface IRemoveChannelActivityResult {
  success: boolean;
  channelId: string;
  username: string;
}

/**
 * opt out response properties
 *
 * @export
 * @interface IChannelNotificationOptOut
 */
export interface IChannelNotificationOptOut {
  channelId: string;
  username: string;
}

/**
 * options for making requests against Discussion API
 *
 * @export
 * @interface IRequestOptions
 * @extends {RequestInit}
 */
// NOTE: this is as close to implementing @esri/hub-common IHubRequestOptions as possible
// only real exception is needing to extend httpMethod to include PATCH and DELETE
// also making isPortal optional for convenience
// picking fields from requestInit for development against local api
export interface IDiscussionsRequestOptions
  extends Omit<IHubRequestOptions, "httpMethod" | "isPortal">,
    Pick<RequestInit, "mode" | "cache" | "credentials"> {
  httpMethod?: "GET" | "POST" | "PATCH" | "DELETE";
  isPortal?: boolean;
  token?: string;
  data?: { [key: string]: any };
}

/**
 * Role types
 *
 * @export
 * @enum {string}
 */
export enum Role {
  READ = "read",
  WRITE = "write",
  READWRITE = "readWrite",
  MODERATE = "moderate",
  MANAGE = "manage",
  OWNER = "owner",
}

/**
 * Interface representing the meta data associated with a discussions
 * mention email
 */
export interface IDiscussionsMentionMeta {
  channelId: string;
  discussion: string;
  postId: string;
  replyId?: string;
}

export interface IDiscussionsUser extends IUser {
  username?: string | null;
}

/**
 * representation of reaction from the service
 *
 * @export
 * @interface IReaction
 * @extends {IWithAuthor}
 * @extends {IWithEditor}
 * @extends {IWithTimestamps}
 */
export interface IReaction extends IWithAuthor, IWithEditor, IWithTimestamps {
  id: string;
  value: PostReaction;
  postId?: string;
  post?: IPost;
}

/**
 * dto for creating a reaction
 *
 * @export
 * @interface ICreateReaction
 */
export interface ICreateReaction {
  postId: string;
  value: PostReaction;
}

/**
 * request options for creating a reaction to a post
 *
 * @export
 * @interface ICreateReactionOptions
 * @extends {IHubRequestOptions}
 */
export interface ICreateReactionOptions extends IDiscussionsRequestOptions {
  data: ICreateReaction;
}

/**
 * request options for deleting a reaction
 *
 * @export
 * @interface IRemoveReactionOptions
 * @extends {IHubRequestOptions}
 */
export interface IRemoveReactionOptions extends IDiscussionsRequestOptions {
  reactionId: string;
}

/**
 * delete reaction response properties
 *
 * @export
 * @interface IRemoveReactionResponse
 */
export interface IRemoveReactionResponse {
  success: boolean;
  reactionId: string;
}

/**
 * Post sorting fields
 *
 * @enum {string}
 */
export enum PostSort {
  BODY = "body",
  CHANNEL_ID = "channelId",
  CREATED_AT = "createdAt",
  CREATOR = "creator",
  DISCUSSION = "discussion",
  EDITOR = "editor",
  ID = "id",
  PARENT_ID = "parentId",
  STATUS = "status",
  TITLE = "title",
  UPDATED_AT = "updatedAt",
}

/**
 * Post types
 *
 * @enum{string}
 */
export enum PostType {
  Text = "text",
  Announcement = "announcement",
  Poll = "poll",
  Question = "question",
}

export type PostReactionSummary = {
  [key in PostReaction]: string[];
};

/**
 * representation of post from service
 *
 * @export
 * @interface IPost
 * @extends {IWithAuthor}
 * @extends {IWithEditor}
 * @extends {IWithTimestamps}
 */
export interface IPost extends IWithAuthor, IWithEditor, IWithTimestamps {
  id: string;
  title: string | null;
  body: string;
  status: PostStatus;
  appInfo: string | null; // this is a catch-all field for app-specific information about a post, added for Urban
  discussion: string | null;
  geometry: Geometry | null;
  featureGeometry: Geometry | null;
  postType: PostType;
  channelId?: string;
  channel?: IChannel;
  parentId?: string;
  parent?: IPost | null;
  replies?: IPost[] | IPagedResponse<IPost>;
  replyCount?: number;
  reactions?: PostReactionSummary;
  userReactions?: IReaction[];
}

/**
 * base paramaters for creating a post
 *
 * @export
 * @interface IPostOptions
 */
export interface IPostOptions {
  body: string;
  title?: string;
  discussion?: string;
  geometry?: Geometry;
  featureGeometry?: Geometry;
  appInfo?: string;
}

/**
 * dto for creating a post in a known channel
 *
 * @export
 * @interface ICreatePost
 * @extends {IPostOptions}
 */
export interface ICreatePost extends IPostOptions {
  channelId: string;
}

/**
 * dto for creating a post in a unknown or not yet created channel
 *
 * @export
 * @interface ICreateChannelPost
 * @extends {IPostOptions}
 * @extends {ICreateChannel}
 */
export interface ICreateChannelPost extends IPostOptions, ICreateChannel {}

/**
 * request options for creating post
 *
 * @export
 * @interface ICreatePostParams
 * @extends {IHubRequestOptions}
 */
export interface ICreatePostParams extends IDiscussionsRequestOptions {
  data: ICreatePost | ICreateChannelPost;
  mentionUrl?: string;
}

/**
 * request options for creating reply to post
 *
 * @export
 * @interface ICreateReplyParams
 * @extends {IHubRequestOptions}
 */
export interface ICreateReplyParams extends IDiscussionsRequestOptions {
  postId: string;
  data: IPostOptions;
  mentionUrl?: string;
}

/**
 * dto for decorating found post with relations
 *
 * @export
 * @interface IFetchPost
 */
export interface IFetchPost {
  relations?: PostRelation[];
}

/**
 * dto for querying posts in a single channel
 *
 * @export
 * @interface ISearchChannelPosts
 * @extends {Partial<IWithAuthor>}
 * @extends {Partial<IWithEditor>}
 * @extends {Partial<IPagingParams>}
 * @extends {Partial<IWithSorting<PostSort>>}
 * @extends {Partial<IWithTimeQueries>}
 */
export interface ISearchPosts
  extends Partial<IWithAuthor>,
    Partial<IWithEditor>,
    Partial<IPagingParams>,
    Partial<IWithSorting<PostSort>>,
    Partial<IWithTimeQueries> {
  title?: string;
  body?: string;
  discussion?: string;
  geometry?: Geometry;
  featureGeometry?: Geometry;
  parents?: Array<string | null>;
  status?: PostStatus[];
  relations?: PostRelation[];
  groups?: string[];
  access?: SharingAccess[];
  channels?: string[];
}

/**
 * dto for updating a post's channel
 *
 * @export
 * @interface IUpdatePostSharing
 * @extends {ICreateChannelPermissions}
 */
export interface IUpdatePostSharing extends ICreateChannelPermissions {
  channelId?: string;
}

/**
 * dto for updating a post's status
 *
 * @export
 * @interface IUpdatePostStatus
 */
export interface IUpdatePostStatus {
  status: PostStatus;
}

/**
 * dto for updating a post's content
 *
 * @export
 * @interface IUpdatePost
 */
export interface IUpdatePost {
  title?: string;
  body?: string;
}

/**
 * request options for querying posts
 *
 * @export
 * @interface ISearchPostsParams
 * @extends {IHubRequestOptions}
 */
export interface ISearchPostsParams extends IDiscussionsRequestOptions {
  data?: ISearchPosts;
}

/**
 * request params for getting post
 *
 * @export
 * @interface IFetchPostParams
 * @extends {IHubRequestOptions}
 */
export interface IFetchPostParams extends IDiscussionsRequestOptions {
  postId: string;
  data?: IFetchPost;
}

/**
 * request options for updating post
 *
 * @export
 * @interface IUpdatePostParams
 * @extends {IHubRequestOptions}
 */
export interface IUpdatePostParams extends IDiscussionsRequestOptions {
  postId: string;
  data: IUpdatePost;
  mentionUrl?: string;
}

/**
 * request options for updating a post's channel
 *
 * @export
 * @interface IUpdatePostSharingParams
 * @extends {IHubRequestOptions}
 */
export interface IUpdatePostSharingParams extends IDiscussionsRequestOptions {
  postId: string;
  data: IUpdatePostSharing;
}

/**
 * request options for updating a post's status
 *
 * @export
 * @interface IUpdatePostStatusParams
 * @extends {IHubRequestOptions}
 */
export interface IUpdatePostStatusParams extends IDiscussionsRequestOptions {
  postId: string;
  data: IUpdatePostStatus;
}

/**
 * request options for deleting a post
 *
 * @export
 * @interface IRemovePostParams
 * @extends {IHubRequestOptions}
 */
export interface IRemovePostParams extends IDiscussionsRequestOptions {
  postId: string;
}

/**
 * delete post response properties
 *
 * @export
 * @interface IRemovePostResponse
 */
export interface IRemovePostResponse {
  success: boolean;
  postId: string;
}

/**
 * Channel sorting fields
 *
 * @export
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
  users: {
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
  blockWords?: string[];
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
 * @extends {ICreateChannelPermissions}
 */
export interface ICreateChannel
  extends ICreateChannelSettings,
    ICreateChannelPermissions {}

/**
 * representation of channel entity
 *
 * @export
 * @interface IChannel
 * @extends {IWithAuthor}
 * @extends {IWithEditor}
 * @extends {IWithTimestamps}
 */
export interface IChannel extends IWithAuthor, IWithEditor, IWithTimestamps {
  id: string;
  posts?: IPost[];
  allowReply: boolean;
  allowAnonymous: boolean;
  softDelete: boolean;
  defaultPostStatus: PostStatus;
  allowReaction: boolean;
  allowedReactions: PostReaction[] | null;
  blockWords: string[] | null;
  name: string | null;
  access: SharingAccess;
  orgs: string[];
  groups: string[];
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
