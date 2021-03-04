import { IAuthenticationManager } from "@esri/arcgis-rest-request";
import { Geometry } from "geojson";

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC"
}

export enum PostReaction {
  THUMBS_UP = "thumbs_up",
  THUMBS_DOWN = "thumbs_down",
  THINKING = "thinking",
  HEART = "heart",
  HUNDRED = "100",
  SAD = "sad",
  LAUGH = "laugh",
  SURPRISED = "surprised"
}

export enum SharingAccess {
  PUBLIC = "public",
  ORG = "org",
  PRIVATE = "private"
}

export enum PostStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  DELETED = "deleted",
  HIDDEN = "hidden"
}

export enum DiscussionType {
  DATASET = "dataset",
  ITEM = "item",
  GROUP = "group"
}

export enum DiscussionSource {
  HUB = "hub",
  AGO = "ago",
  URBAN = "urban"
}

export enum PostRelation {
  REPLIES = "replies",
  REACTIONS = "reactions",
  PARENT = "parent",
  CHANNEL = "channel"
}

export enum ChannelRelation {
  SETTINGS = "settings"
}

export enum ReactionRelation {
  POST = "post"
}

// mixins

export interface IWithAuthor {
  creator: string;
  editor: string;
}

export interface IWithPagination {
  limit: number;
  page: number;
}

export interface IWithSettings {
  allowReply: boolean;
  allowAnonymous: boolean;
  softDelete: boolean;
  defaultPostStatus: PostStatus;
  allowReaction: boolean;
  allowedReactions: PostReaction[];
  blockwords?: string[];
}

export interface IWithSharing {
  access: SharingAccess;
  groups?: string[];
  orgs?: string[];
}

export interface IWithSorting {
  sortBy: string;
  sortOrder: SortOrder;
}

export interface IWithTimeQueries {
  createdBefore: Date;
  createdAfter: Date;
  updatedBefore: Date;
  updatedAfter: Date;
}

export interface IWithTimestamps {
  createdAt: Date;
  updatedAt: Date;
}

// dto

// // posts

export interface ICreateChannelPostDTO {
  title?: string;
  body: string;
  discussion?: string;
  geometry?: Geometry;
}

export interface ICreatePostDTO extends ICreateChannelPostDTO, IWithSharing {}

export interface IFindPostDTO {
  relations?: PostRelation[];
}

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

export interface IQueryPostsDTO extends IQueryChannelPostsDTO {
  groups?: string[];
  access?: SharingAccess[];
}

export interface IUpdatePostSharingDTO extends Partial<IWithSharing> {}

export interface IUpdatePostStatusDTO {
  status: PostStatus;
}

export interface IUpdatePostDTO {
  title?: string;
  body?: string;
}

// // channels

export interface ICreateChannelDTO extends IWithSettings, IWithSharing {}

export interface IFindChannelDTO {
  relations?: ChannelRelation[];
}

export interface IQueryChannelsDTO
  extends Partial<IWithPagination>,
    Partial<IWithSorting>,
    Partial<IWithTimeQueries> {
  groups?: string[];
  access?: SharingAccess[];
  relations?: ChannelRelation[];
}

export interface IUpdateChannelDTO extends Partial<IWithSettings> {}

// // reactions

export interface ICreateReactionDTO {
  value: PostReaction;
}

// request options

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

export interface IQueryPostsOptions extends IRequestOptions {
  params: {
    query: IQueryPostsDTO;
  };
}

export interface IQueryChannelPostsOptions extends IRequestOptions {
  params: {
    query: IQueryChannelPostsDTO;
    channelId: number;
  };
}

export interface ICreatePostOptions extends IRequestOptions {
  params: {
    body: ICreatePostDTO;
  };
}

export interface ICreateChannelPostOptions extends IRequestOptions {
  params: {
    body: ICreateChannelPostDTO;
    channelId: number;
  };
}

export interface ICreateReplyOptions extends IRequestOptions {
  params: {
    body: ICreatePostDTO;
    postId: number;
  };
}

export interface ICreateChannelReplyOptions extends IRequestOptions {
  params: {
    body: ICreateChannelPostDTO;
    postId: number;
    channelId: number;
  };
}

export interface IFindPostOptions extends IRequestOptions {
  params: {
    query?: IFindPostDTO;
    postId: number;
  };
}

export interface IFindChannelPostOptions extends IRequestOptions {
  params: {
    query?: IFindPostDTO;
    postId: number;
    channelId: number;
  };
}

export interface IUpdatePostOptions extends IRequestOptions {
  params: {
    body: IUpdatePostDTO;
    postId: number;
  };
}

export interface IUpdateChannelPostOptions extends IRequestOptions {
  params: {
    body: IUpdatePostDTO;
    postId: number;
    channelId: number;
  };
}

export interface IUpdatePostSharingOptions extends IRequestOptions {
  params: {
    body: IUpdatePostSharingDTO;
    postId: number;
  };
}

export interface IUpdateChannelPostSharingOptions extends IRequestOptions {
  params: {
    body: IUpdatePostSharingDTO;
    postId: number;
    channelId: number;
  };
}

export interface IUpdatePostStatusOptions extends IRequestOptions {
  params: {
    body: IUpdatePostStatusDTO;
    postId: number;
  };
}

export interface IUpdateChannelPostStatusOptions extends IRequestOptions {
  params: {
    body: IUpdatePostStatusDTO;
    postId: number;
    channelId: number;
  };
}

export interface IDeletePostOptions extends IRequestOptions {
  params: {
    postId: number;
  };
}

export interface IDeleteChannelPostOptions extends IRequestOptions {
  params: {
    postId: number;
    channelId: number;
  };
}

// // channels

export interface IQueryChannelsOptions extends IRequestOptions {
  params: {
    query: IQueryChannelsDTO;
  };
}

export interface ICreateChannelOptions extends IRequestOptions {
  params: {
    body: ICreateChannelDTO;
  };
}

export interface IFindChannelOptions extends IRequestOptions {
  params: {
    query?: IFindChannelDTO;
    channelId: number;
  };
}

export interface IUpdateChannelOptions extends IRequestOptions {
  params: {
    body: IUpdateChannelDTO;
    channelId: number;
  };
}

export interface IDeleteChannelOptions extends IRequestOptions {
  params: {
    channelId: number;
  };
}

// // reactions

export interface ICreateReactionOptions extends IRequestOptions {
  params: {
    body: ICreateReactionDTO;
    postId: number;
  };
}

export interface IDeleteReactionOptions extends IRequestOptions {
  params: {
    postId: number;
    reactionId: number;
  };
}
