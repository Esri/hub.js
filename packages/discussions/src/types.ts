import { IHubRequestOptions } from "@esri/hub-common";
import {
  IPagedResponse as IRestPagedResponse,
  IUser,
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
