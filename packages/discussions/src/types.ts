import { IHubRequestOptions as _IHubRequestOptions } from "@esri/hub-common";
import {
  IPagedResponse as IRestPagedResponse,
  IPagingParams,
} from "@esri/arcgis-rest-types";
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
 * relations of channel entity
 *
 * @export
 * @enum {string}
 */
export enum ChannelRelation {
  SETTINGS = "settings",
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

// mixins

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
 * channel settings properties
 *
 * @export
 * @interface IWithSettings
 */
export interface IWithSettings {
  allowReply: boolean;
  allowAnonymous: boolean;
  softDelete: boolean;
  defaultPostStatus: PostStatus;
  allowReaction: boolean;
  allowedReactions?: PostReaction[];
  blockwords?: string[];
}

/**
 * channel definition properties, mirroring AGOL sharing ACL & IPlatformSharing
 *
 * @export
 * @interface IWithSharing
 */
export interface IWithSharing {
  access: SharingAccess;
  groups?: string[];
  orgs?: string[];
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
 * delete reaction response properties
 *
 * @export
 * @interface IRemoveReactionResponse
 */
export interface IRemoveReactionResponse {
  success: boolean;
  reactionId: string;
}

// dto

// // posts

/**
 * representation of post entity
 *
 * @export
 * @interface IPost
 * @extends {IWithAuthor}
 * @extends {IWithEditor}
 * @extends {IWithTimestamps}
 */
export interface IPost extends IWithAuthor, IWithEditor, IWithTimestamps {
  id: string;
  title?: string;
  body: string;
  discussion?: string;
  status: PostStatus;
  geometry?: Geometry;
  featureGeometry?: Geometry;
  appInfo?: string; // this is a catch-all field for app-specific information about a post, added for Urban
  channelId?: string;
  channel?: IChannel;
  parentId?: string;
  parent?: IPost;
  replies?: IPost[] | IPagedResponse<IPost>;
  replyCount?: number;
  reactions?: IReaction[];
  userReactions?: IReaction[];
}

/**
 * dto for creating a post in a known channel
 *
 * @export
 * @interface ICreateChannelPost
 */
export interface ICreateChannelPost {
  title?: string;
  body: string;
  channelId: string;
  discussion?: string;
  geometry?: Geometry;
  featureGeometry?: Geometry;
  appInfo?: string;
}

/**
 * paramaters for creating a post in an unknown channel
 *
 * @export
 * @interface ICreatePost
 * @extends {Omit<ICreateChannelPost, 'channelId'>}
 * @extends {IWithSharing}
 */
export interface ICreatePost
  extends Omit<ICreateChannelPost, "channelId">,
    IWithSharing {}

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
 * @extends {Partial<IWithSharing>}
 */
export interface IUpdatePostSharing extends Partial<IWithSharing> {
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
 * @extends {Partial<Omit<ICreateChannelPost, 'channelId'>>}
 */
export interface IUpdatePost
  extends Partial<Omit<ICreateChannelPost, "channelId">> {}

// channels
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
  extends IWithSettings,
    IWithSharing,
    IWithAuthor,
    IWithEditor,
    IWithTimestamps {
  id: string;
}

/**
 * dto for creating a channel
 *
 * @export
 * @interface ICreateChannel
 * @extends {IWithSettings}
 * @extends {IWithSharing}
 */
export interface ICreateChannel extends Partial<IWithSettings>, IWithSharing {}

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
  extends Partial<IWithSettings>,
    Partial<IWithAuthor> {}

// // reactions

/**
 * representation of reaction entity
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

// request options

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
export interface IHubRequestOptions
  extends Omit<_IHubRequestOptions, "httpMethod" | "isPortal">,
    Pick<RequestInit, "mode" | "cache" | "credentials"> {
  httpMethod?: "GET" | "POST" | "PATCH" | "DELETE";
  isPortal?: boolean;
  token?: string;
}

// // posts

/**
 * request options for querying posts
 *
 * @export
 * @interface ISearchPostsOptions
 * @extends {IHubRequestOptions}
 */
export interface ISearchPostsOptions extends IHubRequestOptions {
  params?: ISearchPosts;
}

/**
 * request options for creating post
 *
 * @export
 * @interface ICreatePostOptions
 * @extends {IHubRequestOptions}
 */
export interface ICreatePostOptions extends IHubRequestOptions {
  params: ICreatePost | ICreateChannelPost;
  mentionUrl?: string;
}

/**
 * request options for creating reply to post
 *
 * @export
 * @interface ICreateReplyOptions
 * @extends {ICreatePostOptions}
 */
export interface ICreateReplyOptions extends ICreatePostOptions {
  postId: string;
}

/**
 * request options for getting post
 *
 * @export
 * @interface IFetchPostOptions
 * @extends {IHubRequestOptions}
 */
export interface IFetchPostOptions extends IHubRequestOptions {
  postId: string;
  params?: IFetchPost;
}

/**
 * request options for updating post
 *
 * @export
 * @interface IUpdatePostOptions
 * @extends {IHubRequestOptions}
 */
export interface IUpdatePostOptions extends IHubRequestOptions {
  postId: string;
  params: IUpdatePost;
  mentionUrl?: string;
}

/**
 * request options for updating a post's channel
 *
 * @export
 * @interface IUpdatePostSharingOptions
 * @extends {IHubRequestOptions}
 */
export interface IUpdatePostSharingOptions extends IHubRequestOptions {
  postId: string;
  params: IUpdatePostSharing;
}

/**
 * request options for updating a post's status
 *
 * @export
 * @interface IUpdatePostStatusOptions
 * @extends {IHubRequestOptions}
 */
export interface IUpdatePostStatusOptions extends IHubRequestOptions {
  postId: string;
  params: IUpdatePostStatus;
}

/**
 * request options for deleting a post
 *
 * @export
 * @interface IRemovePostOptions
 * @extends {IHubRequestOptions}
 */
export interface IRemovePostOptions extends IHubRequestOptions {
  postId: string;
}

// // channels

/**
 * request options for searching channels
 *
 * @export
 * @interface ISearchChannelsOptions
 * @extends {IHubRequestOptions}
 */
export interface ISearchChannelsOptions extends IHubRequestOptions {
  params?: ISearchChannels;
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
 * permission object that will populate ACL interface
 *
 * @export
 * @interface IPermission
 */
export interface IPermission {
  role: Role;
  createdAt: string;
  updatedAt: string;
  accessibleAfter: string;
}

/**
 * request options for creating channel with ACL
 *
 * @export
 * @interface IWithACL
 * @extends {ICreateChannelWithACL}
 */
export interface ICreateChannelWithACL extends IWithSettings {
  anonymous?: IPermission;
  authenticated?: IPermission;
  groups?: {
    [key: string]: IPermission;
  };
  orgs?: {
    [key: string]: IPermission;
  };
  users: {
    [key: string]: IPermission;
  };
}

/**
 * request options for creating a channel
 *
 * @export
 * @interface ICreateChannelOptions
 * @extends {IHubRequestOptions}
 */
export interface ICreateChannelOptions extends IHubRequestOptions {
  params: ICreateChannel | ICreateChannelWithACL;
}

/**
 * request options for getting a channel
 *
 * @export
 * @interface IFetchChannelOptions
 * @extends {IHubRequestOptions}
 */
export interface IFetchChannelOptions extends IHubRequestOptions {
  channelId: string;
  params?: IFetchChannel;
}

/**
 * request options for updating a channel's settings
 *
 * @export
 * @interface IUpdateChannelOptions
 * @extends {IHubRequestOptions}
 */
export interface IUpdateChannelOptions extends IHubRequestOptions {
  channelId: string;
  params: IUpdateChannel;
}

/**
 * request options for deleting a channel
 *
 * @export
 * @interface IRemoveChannelOptions
 * @extends {IHubRequestOptions}
 */
export interface IRemoveChannelOptions extends IHubRequestOptions {
  channelId: string;
}

// // reactions

/**
 * request options for creating a reaction to a post
 *
 * @export
 * @interface ICreateReactionOptions
 * @extends {IHubRequestOptions}
 */
export interface ICreateReactionOptions extends IHubRequestOptions {
  params: ICreateReaction;
}

/**
 * request options for deleting a reaction
 *
 * @export
 * @interface IRemoveReactionOptions
 * @extends {IHubRequestOptions}
 */
export interface IRemoveReactionOptions extends IHubRequestOptions {
  reactionId: string;
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
