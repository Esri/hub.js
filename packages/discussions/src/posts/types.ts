import { IPagingParams } from "@esri/arcgis-rest-types";
import { Geometry } from "geojson";
import { IChannel } from "../channels";
import { IReaction } from "../reactions";
import {
  IDiscussionsRequestOptions,
  IPagedResponse,
  IWithAuthor,
  IWithChannelSettings,
  IWithEditor,
  IWithPlatformSharing,
  IWithSorting,
  IWithTimeQueries,
  IWithTimestamps,
  PostRelation,
  PostStatus,
  SharingAccess,
} from "../types";

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
  body: string;
  channelId: string;
  channel: IChannel;
  title?: string;
  discussion?: string;
  geometry?: Geometry;
  featureGeometry?: Geometry;
  appInfo?: string; // this is a catch-all field for app-specific information about a post, added for Urban
  status: PostStatus;
  parentId?: string;
  parent?: IPost;
  replies?: IPost[] | IPagedResponse<IPost>;
  replyCount?: number;
  reactions?: IReaction[];
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
 */
export interface ICreatePost extends IPostOptions {
  channelId: string;
}

/**
 * dto for creating a post in a unknown or not yet created channel
 *
 * @export
 * @interface ICreateChannelPost
 */
export interface ICreateChannelPost
  extends IPostOptions,
    IWithPlatformSharing,
    Partial<IWithChannelSettings> {}

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
 * @extends {Partial<IWithPlatformSharing>}
 */
export interface IUpdatePostSharing extends Partial<IWithPlatformSharing> {
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
