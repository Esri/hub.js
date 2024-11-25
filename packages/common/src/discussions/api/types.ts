import {
  IPagingParams,
  IPagedResponse as IRestPagedResponse,
  IUser,
} from "@esri/arcgis-rest-types";
import { Geometry, Polygon } from "geojson";
import { IHubRequestOptions } from "../../types";

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
  CLAPPING_HANDS = "clapping_hands",
  CONFUSED = "confused",
  DOWN_ARROW = "down_arrow",
  EYES = "eyes",
  FACE_WITH_TEARS_OF_JOY = "face_with_tears_of_joy",
  FIRE = "fire",
  GRINNING = "grinning",
  HEART = "heart",
  LAUGH = "laugh",
  ONE_HUNDRED = "one_hundred",
  PARTYING = "partying",
  PARTY_POPPER = "party_popper",
  RAISING_HANDS = "raising_hands",
  ROCKET = "rocket",
  SAD = "sad",
  SLIGHTLY_SMILING = "slightly_smiling",
  SURPRISED = "surprised",
  THINKING = "thinking",
  THUMBS_UP = "thumbs_up",
  THUMBS_DOWN = "thumbs_down",
  TROPHY = "trophy",
  UP_ARROW = "up_arrow",
  WAVING_HAND = "waving_hand",
  WINKING = "winking",
  WORLD_MAP = "world_map",
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
  BLOCKED = "blocked",
}

/**
 * possible discussion content types, i.e. a post can be about an item, dataset, or group
 *
 * @export
 * @enum {string}
 */
export enum DiscussionType {
  GROUP = "group",
  CONTENT = "content",
  BOARD = "board",
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
  CHANNEL_ACL = "channelAcl",
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

/**
 * @export
 * @enum {string}
 */
export enum CommonSort {
  CREATED_AT = "createdAt",
  CREATOR = "creator",
  EDITOR = "editor",
  ID = "id",
  UPDATED_AT = "updatedAt",
}

/**
 * @export
 * @enum {string}
 */
export enum SearchPostsFormat {
  CSV = "csv",
  JSON = "json",
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
 * @interface IDiscussionsRequestOptions
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
  MANAGE = "manage",
  /** Not API supported */
  MODERATE = "moderate",
  /** Not API supported */
  OWNER = "owner",
  READ = "read",
  READWRITE = "readWrite",
  /** Not API supported */
  WRITE = "write",
}

/**
 * Interface representing the meta data associated with a discussions
 * mention email
 *
 * @export
 * @interface IDiscussionsMentionMeta
 */
export interface IDiscussionsMentionMeta {
  channelId: string;
  discussion: string;
  postId: string;
  replyId?: string;
}

/**
 * @export
 * @interface IDiscussionsUser
 * @extends {IUser}
 */
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
 * @export
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
 * @export
 * @enum{string}
 */
export enum PostType {
  Text = "text",
  Announcement = "announcement",
  Poll = "poll",
  Question = "question",
}

/**
 * representation of post from service
 *
 * @export
 * @interface IPost
 * @extends {IWithAuthor}
 * @extends {IWithEditor}
 * @extends {IWithTimestamps}
 */
export interface IPost
  extends Partial<IWithAuthor>,
    Partial<IWithEditor>,
    IWithTimestamps {
  id: string;
  appInfo: string | null; // this is a catch-all field for app-specific information about a post, added for Urban
  body: string;
  channel?: IChannel;
  channelId?: string;
  discussion: string | null;
  featureGeometry: Geometry | null;
  geometry: Geometry | null;
  parent?: IPost | null;
  parentId: string | null;
  postType: PostType;
  reactions?: IReaction[];
  replies?: IPost[] | IPagedResponse<IPost>;
  replyCount?: number;
  status: PostStatus;
  title: string | null;
}

/**
 * parameters for creating a post
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
  asAnonymous?: boolean;
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
 * request options for creating post
 *
 * @export
 * @interface ICreatePostParams
 * @extends {IHubRequestOptions}
 */
export interface ICreatePostParams extends IDiscussionsRequestOptions {
  data: ICreatePost;
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
 * @extends {Partial<IPagingParams>}
 */
export interface IFetchPost extends Partial<IPagingParams> {
  relations?: PostRelation[];
}

/**
 * dto for searching posts
 *
 * @export
 * @interface ISearchChannelPosts
 * @extends {Partial<IPagingParams>}
 * @extends {Partial<IWithSorting<PostSort>>}
 * @extends {Partial<IWithTimeQueries>}
 */
export interface ISearchPosts
  extends Partial<IPagingParams>,
    Partial<IWithSorting<PostSort>>,
    Partial<IWithTimeQueries> {
  access?: SharingAccess[];
  body?: string;
  channels?: string[];
  creator?: string | null;
  discussion?: string | null;
  editor?: string | null;
  f?: SearchPostsFormat;
  featureGeometry?: Geometry;
  geometry?: Geometry;
  groups?: string[] | null;
  parents?: string[] | null;
  postType?: PostType;
  relations?: PostRelation[];
  status?: PostStatus[];
  title?: string;
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
  asAnonymous?: boolean;
  title?: string;
  body?: string;
  discussion?: string | null;
  geometry?: Geometry | null;
  featureGeometry?: Geometry | null;
  appInfo?: string | null;
}

/**
 * request options for querying posts
 *
 * @export
 * @interface ISearchPostsParams
 * @extends {IDiscussionsRequestOptions}
 */
export interface ISearchPostsParams extends IDiscussionsRequestOptions {
  data?: ISearchPosts;
}

/**
 * request options for exporting posts as CSV
 *
 * @export
 * @interface IExportPostsParams
 * @extends {IDiscussionsRequestOptions}
 */
export interface IExportPostsParams extends IDiscussionsRequestOptions {
  data?: ISearchPosts;
}

/**
 * request params for getting post
 *
 * @export
 * @interface IFetchPostParams
 * @extends {IDiscussionsRequestOptions}
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
 * @extends {IDiscussionsRequestOptions}
 */
export interface IUpdatePostParams extends IDiscussionsRequestOptions {
  postId: string;
  data: IUpdatePost;
  mentionUrl?: string;
}

/**
 * request options for updating a post's status
 *
 * @export
 * @interface IUpdatePostStatusParams
 * @extends {IDiscussionsRequestOptions}
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
 * @extends {IDiscussionsRequestOptions}
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
  CHANNEL_ACL = "channelAcl",
}

/**
 * @export
 * @enum {string}
 */
export enum AclCategory {
  ANONYMOUS_USER = "anonymousUser",
  AUTHENTICATED_USER = "authenticatedUser",
  GROUP = "group",
  ORG = "org",
  /** Not API supported */
  USER = "user",
}

/**
 * @export
 * @enum {string}
 */
export enum AclSubCategory {
  /** Only valid for category: `group` or `org` */
  ADMIN = "admin",
  /** Only valid for category: `group` or `org` */
  MEMBER = "member",
}

/**
 * request option for creating a channel ACL permission
 *
 * @export
 * @interface IChannelAclPermissionDefinition
 */
export interface IChannelAclPermissionDefinition {
  category: AclCategory;
  /** Only valid for category: `group` or `org` */
  subCategory?: AclSubCategory;
  /** Ago `group_id` or `org_id` or `user.username` <br> Invalid for category: `anonymousUser, authenticatedUser` */
  key?: string;
  role: Role;
  restrictedBefore?: string;
}

/**
 * request option for updating a channel ACL permission
 *
 * @export
 * @interface IChannelAclPermissionUpdateDefinition
 * @extends {IChannelAclPermissionDefinition}
 */
export interface IChannelAclPermissionUpdateDefinition
  extends IChannelAclPermissionDefinition {
  channelId: string;
}

/**
 * representation of channelAcl permission from service
 *
 * @export
 * @interface IChannelAclPermission
 * @extends {IChannelAclPermissionDefinition}
 * @extends {IWithAuthor}
 * @extends {IWithEditor}
 * @extends {IWithTimestamps}
 */
export interface IChannelAclPermission
  extends IChannelAclPermissionDefinition,
    IWithAuthor,
    IWithEditor,
    IWithTimestamps {
  id: string;
  restrictedBefore: string;
}

/**
 * settings parameters for creating a channel
 *
 * @export
 * @interface ICreateChannelSettings
 */
export interface ICreateChannelSettings {
  allowAsAnonymous?: boolean;
  allowedReactions?: PostReaction[];
  allowPost?: boolean;
  allowReaction?: boolean;
  allowReply?: boolean;
  blockWords?: string[];
  defaultPostStatus?: PostStatus;
  metadata?: IChannelMetadata;
  name: string;
  softDelete?: boolean;
}

/**
 * @export
 * @interface IChannelMetadata
 */
export interface IChannelMetadata {
  guidelineUrl?: string | null;
}

/**
 * permissions parameters for creating a channel
 *
 * @export
 * @interface ICreateChannelPermissions
 */
export interface ICreateChannelPermissions {
  channelAclDefinition: IChannelAclPermissionDefinition[];
}

/**
 * permissions parameters for updating a channel
 *
 * @export
 * @interface IUpdateChannelPermissions
 */
export interface IUpdateChannelPermissions {
  channelAclDefinition?: IChannelAclPermissionDefinition[];
}

/**
 * parameters for creating a channel
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
 * representation of channel from service
 *
 * @export
 * @interface IChannel
 * @extends {IWithAuthor}
 * @extends {IWithEditor}
 * @extends {IWithTimestamps}
 */
export interface IChannel extends IWithAuthor, IWithEditor, IWithTimestamps {
  id: string;
  /** deprecated V1 permissions field, use channelAcl */
  access: SharingAccess | null;
  /** deprecated V1 permissions field, use channelAcl */
  orgs: string[] | null;
  /** deprecated V1 permissions field, use channelAcl */
  allowAnonymous: boolean | null;
  /** deprecated V1 permissions field, use channelAcl */
  groups: string[] | null;
  allowAsAnonymous: boolean;
  allowedReactions: PostReaction[] | null;
  allowPost: boolean;
  allowReaction: boolean;
  allowReply: boolean;
  blockWords: string[] | null;
  channelAcl?: IChannelAclPermission[];
  defaultPostStatus: PostStatus;
  metadata: IChannelMetadata | null;
  name: string | null;
  orgId: string;
  posts?: IPost[];
  softDelete: boolean;
}

/**
 * parameters for updating a channel
 *
 * @export
 * @interface IUpdateChannel
 * @extends {IUpdateChannelSettings}
 * @extends {IUpdateChannelPermissions}
 */
export interface IUpdateChannel
  extends IUpdateChannelSettings,
    IUpdateChannelPermissions {}

/**
 * settings parameters for updating a channel
 *
 * @export
 * @interface IUpdateChannelSettings
 */
export interface IUpdateChannelSettings {
  allowAsAnonymous?: boolean;
  allowedReactions?: PostReaction[];
  allowReaction?: boolean;
  allowReply?: boolean;
  blockWords?: string[];
  defaultPostStatus?: PostStatus;
  metadata?: IChannelMetadata;
  name?: string;
  softDelete?: boolean;
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
 * @extends {Partial<IWithFiltering<ChannelFilter>>}
 * @extends {Partial<IWithAuthor>}
 * @extends {Partial<IWithEditor>}
 */
export interface ISearchChannels
  extends Partial<IPagingParams>,
    Partial<IWithSorting<ChannelSort>>,
    Partial<IWithTimeQueries>,
    Partial<IWithFiltering<ChannelFilter>>,
    Partial<IWithAuthor>,
    Partial<IWithEditor> {
  groups?: string[];
  access?: SharingAccess[];
  relations?: ChannelRelation[];
  name?: string;
  orgIds?: string[];
  discussion?: string;
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

/**
 * representation of an entity setting record from the service
 *
 * @export
 * @interface IEntitySetting
 * @extends {IWithAuthor}
 * @extends {IWithEditor}
 * @extends {IWithTimestamps}
 */
export interface IEntitySetting
  extends IWithAuthor,
    IWithEditor,
    IWithTimestamps {
  id: string;
  type: EntitySettingType;
  settings: IEntitySettings;
}

/**
 * @export
 * @enum {string}
 */
export enum EntitySettingType {
  CONTENT = "content",
}

/**
 * @export
 * @interface IEntitySettings
 */
export interface IEntitySettings {
  discussions?: IDiscussionsSettings;
}

/**
 * @export
 * @interface IDiscussionsSettings
 */
export interface IDiscussionsSettings {
  allowedChannelIds?: string[] | null;
  allowedLocations?: Polygon[] | null;
}

/**
 * @export
 * @interface IRemoveSettingResponse
 */
export interface IRemoveSettingResponse {
  id: string;
  success: boolean;
}

/**
 * @export
 * @interface ICreateSetting
 */
export interface ICreateSetting {
  id: string;
  type: EntitySettingType;
  settings: IEntitySettings;
}

/**
 * @export
 * @interface IUpdateSetting
 */
export interface IUpdateSetting {
  settings: Partial<IEntitySettings>;
}

/**
 * parameters for creating a setting
 *
 * @export
 * @interface ICreateSettingParams
 * @extends {IDiscussionsRequestOptions}
 */
export interface ICreateSettingParams extends IDiscussionsRequestOptions {
  data: ICreateSetting;
}

/**
 * parameters for fetching a setting
 *
 * @export
 * @interface IFetchSettingParams
 * @extends {IDiscussionsRequestOptions}
 */
export interface IFetchSettingParams extends IDiscussionsRequestOptions {
  id: string;
}

/**
 * parameters for updating a setting
 *
 * @export
 * @interface IUpdateSettingParams
 * @extends {IDiscussionsRequestOptions}
 */
export interface IUpdateSettingParams extends IDiscussionsRequestOptions {
  id: string;
  data: IUpdateSetting;
}

/**
 * parameters for removing a setting
 *
 * @export
 * @interface IRemoveSettingParams
 * @extends {IDiscussionsRequestOptions}
 */
export interface IRemoveSettingParams extends IDiscussionsRequestOptions {
  id: string;
}
