import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import { IPagedResponse, IPagingParams } from "@esri/arcgis-rest-types";
import { Geometry } from "geojson";

/**
 * sort orders
 *
 * @export
 * @enum {number}
 */
export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC"
}

/**
 * reactions to posts
 *
 * @export
 * @enum {number}
 */
export enum PostReaction {
  THUMBS_UP = "thumbs_up",
  THUMBS_DOWN = "thumbs_down",
  THINKING = "thinking",
  HEART = "heart",
  ONE_HUNDRED = "one_hundred",
  SAD = "sad",
  LAUGH = "laugh",
  SURPRISED = "surprised"
}

/**
 * platform sharing access values
 *
 * @export
 * @enum {number}
 */
export enum SharingAccess {
  PUBLIC = "public",
  ORG = "org",
  PRIVATE = "private"
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
 * @enum {number}
 */
export enum PostStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  DELETED = "deleted",
  HIDDEN = "hidden"
}

/**
 * possible discussionn content types, i.e. a post can be about an item, dataset, or group
 *
 * @export
 * @enum {number}
 */
export enum DiscussionType {
  DATASET = "dataset",
  ITEM = "item",
  GROUP = "group"
}

/**
 * source of a post, i.e. app context
 *
 * @export
 * @enum {number}
 */
export enum DiscussionSource {
  HUB = "hub",
  AGO = "ago",
  URBAN = "urban"
}

/**
 * component parts of a parsed discussion uri, following this uri convention:
 * source://type/id_layer?features=<number>,<number>&attribute=<string>
 * minimal uri - source://type/id
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
 * @enum {number}
 */
export enum PostRelation {
  REPLIES = "replies",
  REACTIONS = "reactions",
  PARENT = "parent",
  CHANNEL = "channel"
}

/**
 * relations of channel entity
 *
 * @export
 * @enum {number}
 */
export enum ChannelRelation {
  SETTINGS = "settings"
}

/**
 * relations of reaction entity
 *
 * @export
 * @enum {number}
 */
export enum ReactionRelation {
  POST = "post"
}

// mixins

/**
 * authoring properties
 *
 * @export
 * @interface IWithAuthor
 */
export interface IWithAuthor {
  creator: string;
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
export interface IWithSorting {
  sortBy: string;
  sortOrder: SortOrder;
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

export interface IPagedAPIResponse<PaginationObject> extends IPagedResponse {
  items: PaginationObject[];
}

/**
 * copy-cat of @nestjs/common DeleteResult interface
 * TODO: normalize this interface to look like platform delete, { success: boolean, id: number }
 *
 * @export
 * @interface INestDeleteResult
 */
export interface INestDeleteResult {
  raw: any;
  affected?: number | null;
}

// dto

// // posts

/**
 * representation of post entity
 *
 * @export
 * @interface IPost
 * @extends {IWithAuthor}
 * @extends {IWithTimestamps}
 */
export interface IPost extends IWithAuthor, IWithTimestamps {
  id: number;
  title?: string;
  body: string;
  discussion?: string;
  status: PostStatus;
  geometry?: Geometry;
  channelId?: number;
  channel?: IChannel;
  parentId?: number;
  parent?: IPost;
  replies?: IPost[];
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
  discussion?: string;
  geometry?: Geometry;
}

/**
 * paramaters for creating a post in an unknown channel
 *
 * @export
 * @interface ICreatePost
 * @extends {ICreateChannelPost}
 * @extends {IWithSharing}
 */
export interface ICreatePost extends ICreateChannelPost, IWithSharing {}

/**
 * dto for decorating found post with relations
 *
 * @export
 * @interface IGetPost
 */
export interface IGetPost {
  relations?: PostRelation[];
}

/**
 * dto for querying posts in a single channel
 *
 * @export
 * @interface IQueryChannelPosts
 * @extends {Partial<IWithAuthor>}
 * @extends {Partial<IPagingParams>}
 * @extends {Partial<IWithSorting>}
 * @extends {Partial<IWithTimeQueries>}
 */
export interface IQueryChannelPosts
  extends Partial<IWithAuthor>,
    Partial<IPagingParams>,
    Partial<IWithSorting>,
    Partial<IWithTimeQueries> {
  title?: string;
  body?: string;
  discussion?: string;
  parentId?: number;
  status?: PostStatus[];
  relations?: PostRelation[];
}

/**
 * dto for querying posts in many channels
 *
 * @export
 * @interface IQueryPosts
 * @extends {IQueryChannelPosts}
 */
export interface IQueryPosts extends IQueryChannelPosts {
  groups?: string[];
  access?: SharingAccess[];
}

/**
 * dto for updating a post's channel
 *
 * @export
 * @interface IUpdatePostSharing
 * @extends {Partial<IWithSharing>}
 */
export interface IUpdatePostSharing extends Partial<IWithSharing> {}

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

// // channels
/**
 * representation of channel entity
 *
 * @export
 * @interface IChannel
 * @extends {IWithSettings}
 * @extends {IWithSharing}
 * @extends {IWithAuthor}
 * @extends {IWithTimestamps}
 */
export interface IChannel
  extends IWithSettings,
    IWithSharing,
    IWithAuthor,
    IWithTimestamps {
  id: number;
}

/**
 * dto for creating a channel
 *
 * @export
 * @interface ICreateChannel
 * @extends {IWithSettings}
 * @extends {IWithSharing}
 */
export interface ICreateChannel extends IWithSettings, IWithSharing {}

/**
 * dto for decorating found channel with relations
 *
 * @export
 * @interface IGetChannel
 */
export interface IGetChannel {
  relations?: ChannelRelation[];
}

/**
 * dto for querying channels
 *
 * @export
 * @interface IQueryChannels
 * @extends {Partial<IPagingParams>}
 * @extends {Partial<IWithSorting>}
 * @extends {Partial<IWithTimeQueries>}
 */
export interface IQueryChannels
  extends Partial<IPagingParams>,
    Partial<IWithSorting>,
    Partial<IWithTimeQueries> {
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
 */
export interface IUpdateChannel extends Partial<IWithSettings> {}

// // reactions

/**
 * representation of reaction entity
 *
 * @export
 * @interface IReaction
 * @extends {IWithAuthor}
 * @extends {IWithTimestamps}
 */
export interface IReaction extends IWithAuthor, IWithTimestamps {
  id: number;
  value: PostReaction;
  postId?: number;
  post?: IPost;
}

/**
 * dto for creating a reaction
 *
 * @export
 * @interface ICreateReaction
 */
export interface ICreateReaction {
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
export interface IRequestOptions extends RequestInit {
  authentication?: IAuthenticationManager;
  token?: string;
  portalUrl?: string;
  params?: {
    query?: {
      [key: string]: any;
    };
    body?: {
      [key: string]: any;
    };
    [key: string]: any;
  };
}

// // posts

/**
 * request options for querying posts in many channels
 *
 * @export
 * @interface IQueryPostsOptions
 * @extends {IRequestOptions}
 */
export interface IQueryPostsOptions extends IRequestOptions {
  params: {
    query: IQueryPosts;
  };
}

/**
 * request options for querying posts in single channel
 *
 * @export
 * @interface IQueryChannelPostsOptions
 * @extends {IRequestOptions}
 */
export interface IQueryChannelPostsOptions extends IRequestOptions {
  params: {
    query: IQueryChannelPosts;
    channelId: number;
  };
}

/**
 * request options for creating post in unknown channel
 *
 * @export
 * @interface ICreatePostOptions
 * @extends {IRequestOptions}
 */
export interface ICreatePostOptions extends IRequestOptions {
  params: {
    body: ICreatePost;
  };
}

/**
 * request options for creating post in known channel
 *
 * @export
 * @interface ICreateChannelPostOptions
 * @extends {IRequestOptions}
 */
export interface ICreateChannelPostOptions extends IRequestOptions {
  params: {
    body: ICreateChannelPost;
    channelId: number;
  };
}

/**
 * request options for creating reply to post in unknown channel
 *
 * @export
 * @interface ICreateReplyOptions
 * @extends {IRequestOptions}
 */
export interface ICreateReplyOptions extends IRequestOptions {
  params: {
    body: ICreatePost;
    postId: number;
  };
}

/**
 * request options for creating reply to post in known channel
 *
 * @export
 * @interface ICreateChannelReplyOptions
 * @extends {IRequestOptions}
 */
export interface ICreateChannelReplyOptions extends IRequestOptions {
  params: {
    body: ICreateChannelPost;
    postId: number;
    channelId: number;
  };
}

/**
 * request options for getting post
 *
 * @export
 * @interface IGetPostOptions
 * @extends {IRequestOptions}
 */
export interface IGetPostOptions extends IRequestOptions {
  params: {
    query?: IGetPost;
    postId: number;
  };
}

/**
 * request options for getting post in known channel
 *
 * @export
 * @interface IGetChannelPostOptions
 * @extends {IRequestOptions}
 */
export interface IGetChannelPostOptions extends IRequestOptions {
  params: {
    query?: IGetPost;
    postId: number;
    channelId: number;
  };
}

/**
 * request options for updating post
 *
 * @export
 * @interface IUpdatePostOptions
 * @extends {IRequestOptions}
 */
export interface IUpdatePostOptions extends IRequestOptions {
  params: {
    body: IUpdatePost;
    postId: number;
  };
}

/**
 * request options for updating post in known channel
 *
 * @export
 * @interface IUpdateChannelPostOptions
 * @extends {IRequestOptions}
 */
export interface IUpdateChannelPostOptions extends IRequestOptions {
  params: {
    body: IUpdatePost;
    postId: number;
    channelId: number;
  };
}

/**
 * request options for updating a post's channel
 *
 * @export
 * @interface IUpdatePostSharingOptions
 * @extends {IRequestOptions}
 */
export interface IUpdatePostSharingOptions extends IRequestOptions {
  params: {
    body: IUpdatePostSharing;
    postId: number;
  };
}

/**
 * request options for updating a post's channel from a known channel
 *
 * @export
 * @interface IUpdateChannelPostSharingOptions
 * @extends {IRequestOptions}
 */
export interface IUpdateChannelPostSharingOptions extends IRequestOptions {
  params: {
    body: IUpdatePostSharing;
    postId: number;
    channelId: number;
  };
}

/**
 * request options for updating a post's status
 *
 * @export
 * @interface IUpdatePostStatusOptions
 * @extends {IRequestOptions}
 */
export interface IUpdatePostStatusOptions extends IRequestOptions {
  params: {
    body: IUpdatePostStatus;
    postId: number;
  };
}

/**
 * request options for updating a post's status from a known channel
 *
 * @export
 * @interface IUpdateChannelPostStatusOptions
 * @extends {IRequestOptions}
 */
export interface IUpdateChannelPostStatusOptions extends IRequestOptions {
  params: {
    body: IUpdatePostStatus;
    postId: number;
    channelId: number;
  };
}

/**
 * request options for deleting a post
 *
 * @export
 * @interface IDeletePostOptions
 * @extends {IRequestOptions}
 */
export interface IDeletePostOptions extends IRequestOptions {
  params: {
    postId: number;
  };
}

/**
 * request options for deleting a post from channel
 *
 * @export
 * @interface IDeleteChannelPostOptions
 * @extends {IRequestOptions}
 */
export interface IDeleteChannelPostOptions extends IRequestOptions {
  params: {
    postId: number;
    channelId: number;
  };
}

// // channels

/**
 * request options for querying channels
 *
 * @export
 * @interface IQueryChannelsOptions
 * @extends {IRequestOptions}
 */
export interface IQueryChannelsOptions extends IRequestOptions {
  params: {
    query: IQueryChannels;
  };
}

/**
 * request options for creating a channel
 *
 * @export
 * @interface ICreateChannelOptions
 * @extends {IRequestOptions}
 */
export interface ICreateChannelOptions extends IRequestOptions {
  params: {
    body: ICreateChannel;
  };
}

/**
 * request options for getting a channel
 *
 * @export
 * @interface IGetChannelOptions
 * @extends {IRequestOptions}
 */
export interface IGetChannelOptions extends IRequestOptions {
  params: {
    query?: IGetChannel;
    channelId: number;
  };
}

/**
 * request options for updating a channel's settings
 *
 * @export
 * @interface IUpdateChannelOptions
 * @extends {IRequestOptions}
 */
export interface IUpdateChannelOptions extends IRequestOptions {
  params: {
    body: IUpdateChannel;
    channelId: number;
  };
}

/**
 * request options for deleting a channel
 *
 * @export
 * @interface IDeleteChannelOptions
 * @extends {IRequestOptions}
 */
export interface IDeleteChannelOptions extends IRequestOptions {
  params: {
    channelId: number;
  };
}

// // reactions

/**
 * request options for creating a reaction to a post
 *
 * @export
 * @interface ICreateReactionOptions
 * @extends {IRequestOptions}
 */
export interface ICreateReactionOptions extends IRequestOptions {
  params: {
    body: ICreateReaction;
    postId: number;
  };
}

/**
 * request options for deleting a reaction
 *
 * @export
 * @interface IDeleteReactionOptions
 * @extends {IRequestOptions}
 */
export interface IDeleteReactionOptions extends IRequestOptions {
  params: {
    postId: number;
    reactionId: number;
  };
}
