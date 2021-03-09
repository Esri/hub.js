import { IAuthenticationManager } from "@esri/arcgis-rest-request";
// import { Geometry } from "geojson";

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
 * pagination properties
 *
 * @export
 * @interface IWithPagination
 */
export interface IWithPagination {
  limit: number;
  page: number;
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

interface INestPaginationMeta {
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}
/**
 * copy-cat of nestjs-typeorm-paginate Pagination interface
 * TODO: update API pagination pattern to match existing pagination patterns
 *
 * @export
 * @interface INestPagination
 * @template PaginationObject
 */
export interface INestPagination<PaginationObject> {
  readonly items: PaginationObject[];
  readonly meta: INestPaginationMeta;
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
 * @interface IPostDTO
 * @extends {IWithAuthor}
 * @extends {IWithTimestamps}
 */
export interface IPostDTO extends IWithAuthor, IWithTimestamps {
  id: number;
  title?: string;
  body: string;
  discussion?: string;
  status: PostStatus;
  geometry?: any; // Geometry;
  channelId?: number;
  channel?: IChannelDTO;
  parentId?: number;
  parent?: IPostDTO;
  replies?: IPostDTO[];
  replyCount?: number;
  reactions?: IReactionDTO[];
  userReactions?: IReactionDTO[];
}
/**
 * dto for creating a post in a known channel
 *
 * @export
 * @interface ICreateChannelPostDTO
 */
export interface ICreateChannelPostDTO {
  title?: string;
  body: string;
  discussion?: string;
  geometry?: any; // Geometry;
}

/**
 * paramaters for creating a post in an unknown channel
 *
 * @export
 * @interface ICreatePostDTO
 * @extends {ICreateChannelPostDTO}
 * @extends {IWithSharing}
 */
export interface ICreatePostDTO extends ICreateChannelPostDTO, IWithSharing {}

/**
 * dto for decorating found post with relations
 *
 * @export
 * @interface IFindPostDTO
 */
export interface IFindPostDTO {
  relations?: PostRelation[];
}

/**
 * dto for querying posts in a single channel
 *
 * @export
 * @interface IQueryChannelPostsDTO
 * @extends {Partial<IWithAuthor>}
 * @extends {Partial<IWithPagination>}
 * @extends {Partial<IWithSorting>}
 * @extends {Partial<IWithTimeQueries>}
 */
export interface IQueryChannelPostsDTO
  extends Partial<IWithAuthor>,
    Partial<IWithPagination>,
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
 * @interface IQueryPostsDTO
 * @extends {IQueryChannelPostsDTO}
 */
export interface IQueryPostsDTO extends IQueryChannelPostsDTO {
  groups?: string[];
  access?: SharingAccess[];
}

/**
 * dto for updating a post's channel
 *
 * @export
 * @interface IUpdatePostSharingDTO
 * @extends {Partial<IWithSharing>}
 */
export interface IUpdatePostSharingDTO extends Partial<IWithSharing> {}

/**
 * dto for updating a post's status
 *
 * @export
 * @interface IUpdatePostStatusDTO
 */
export interface IUpdatePostStatusDTO {
  status: PostStatus;
}

/**
 * dto for updating a post's content
 *
 * @export
 * @interface IUpdatePostDTO
 */
export interface IUpdatePostDTO {
  title?: string;
  body?: string;
}

// // channels
/**
 * representation of channel entity
 *
 * @export
 * @interface IChannelDTO
 * @extends {IWithSettings}
 * @extends {IWithSharing}
 * @extends {IWithAuthor}
 * @extends {IWithTimestamps}
 */
export interface IChannelDTO
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
 * @interface ICreateChannelDTO
 * @extends {IWithSettings}
 * @extends {IWithSharing}
 */
export interface ICreateChannelDTO extends IWithSettings, IWithSharing {}

/**
 * dto for decorating found channel with relations
 *
 * @export
 * @interface IFindChannelDTO
 */
export interface IFindChannelDTO {
  relations?: ChannelRelation[];
}

/**
 * dto for querying channels
 *
 * @export
 * @interface IQueryChannelsDTO
 * @extends {Partial<IWithPagination>}
 * @extends {Partial<IWithSorting>}
 * @extends {Partial<IWithTimeQueries>}
 */
export interface IQueryChannelsDTO
  extends Partial<IWithPagination>,
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
 * @interface IUpdateChannelDTO
 * @extends {Partial<IWithSettings>}
 */
export interface IUpdateChannelDTO extends Partial<IWithSettings> {}

// // reactions

/**
 * representation of reaction entity
 *
 * @export
 * @interface IReactionDTO
 * @extends {IWithAuthor}
 * @extends {IWithTimestamps}
 */
export interface IReactionDTO extends IWithAuthor, IWithTimestamps {
  id: number;
  value: PostReaction;
  postId?: number;
  post?: IPostDTO;
}

/**
 * dto for creating a reaction
 *
 * @export
 * @interface ICreateReactionDTO
 */
export interface ICreateReactionDTO {
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
    query: IQueryPostsDTO;
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
    query: IQueryChannelPostsDTO;
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
    body: ICreatePostDTO;
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
    body: ICreateChannelPostDTO;
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
    body: ICreatePostDTO;
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
    body: ICreateChannelPostDTO;
    postId: number;
    channelId: number;
  };
}

/**
 * request options for finding post
 *
 * @export
 * @interface IFindPostOptions
 * @extends {IRequestOptions}
 */
export interface IFindPostOptions extends IRequestOptions {
  params: {
    query?: IFindPostDTO;
    postId: number;
  };
}

/**
 * request options for finding post in known channel
 *
 * @export
 * @interface IFindChannelPostOptions
 * @extends {IRequestOptions}
 */
export interface IFindChannelPostOptions extends IRequestOptions {
  params: {
    query?: IFindPostDTO;
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
    body: IUpdatePostDTO;
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
    body: IUpdatePostDTO;
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
    body: IUpdatePostSharingDTO;
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
    body: IUpdatePostSharingDTO;
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
    body: IUpdatePostStatusDTO;
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
    body: IUpdatePostStatusDTO;
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
    query: IQueryChannelsDTO;
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
    body: ICreateChannelDTO;
  };
}

/**
 * request options for finding a channel
 *
 * @export
 * @interface IFindChannelOptions
 * @extends {IRequestOptions}
 */
export interface IFindChannelOptions extends IRequestOptions {
  params: {
    query?: IFindChannelDTO;
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
    body: IUpdateChannelDTO;
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
    body: ICreateReactionDTO;
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
