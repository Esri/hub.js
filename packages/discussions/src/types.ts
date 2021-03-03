import { IAuthenticationManager } from "@esri/arcgis-rest-request";
// import { Geometry } from 'geojson';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC'
};

export enum PostReaction {
  THUMBS_UP = 'thumbs_up',
  THUMBS_DOWN = 'thumbs_down',
  THINKING = 'thinking',
  HEART = 'heart',
  HUNDRED = '100',
  SAD = 'sad',
  LAUGH = 'laugh',
  SURPRISED = 'surprised'
}

export enum SharingAccess {
  PUBLIC = 'public',
  ORG = 'org',
  PRIVATE = 'private'
}

export enum PostStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DELETED = 'deleted',
  HIDDEN = 'hidden'
}

export enum DiscussionType {
  DATASET = 'dataset',
  ITEM = 'item',
  GROUP = 'group'
}

export enum DiscussionSource {
  HUB = 'hub',
  AGO = 'ago',
  URBAN = 'urban'
}

export enum PostRelation {
  REPLIES = 'replies',
  REACTIONS = 'reactions',
  PARENT = 'parent',
  CHANNEL = 'channel'
}

export enum ChannelRelation {
  SETTINGS = 'settings'
}

export enum ReactionRelation {
  POST = 'post'
}

// mixins

export interface WithAuthor {
  creator: string,
  editor: string
}

export interface WithPagination {
  limit: number,
  page: number
}

export interface WithSettings {
  allowReply: boolean,
  allowAnonymous: boolean,
  softDelete: boolean,
  defaultPostStatus: PostStatus,
  allowReaction: boolean,
  allowedReactions: PostReaction[],
  blockwords?: string[]
}

export interface WithSharing {
  access: SharingAccess,
  groups?: string[],
  orgs?: string[]
}

export interface WithSorting {
  sortBy: string,
  sortOrder: SortOrder
}

export interface WithTimeQueries {
  createdBefore: Date,
  createdAfter: Date,
  updatedBefore: Date,
  updatedAfter: Date
}

export interface WithTimestamps {
  createdAt: Date,
  updatedAt: Date
}

// dto

// // posts

export interface CreateChannelPostDTO {
  title?: string,
  body: string,
  discussion?: string,
  geometry?: any // Geometry
}

export interface CreatePostDTO extends CreateChannelPostDTO, WithSharing {}

export interface FindPostDTO {
  relations?: PostRelation[]
}

export interface QueryChannelPostsDTO extends 
  Partial<WithAuthor>,
  Partial<WithPagination>,
  Partial<WithSorting>,
  Partial<WithTimeQueries>
{
  title?: string,
  body?: string,
  discussion?: string,
  parentId?: number,
  status?: PostStatus[],
  relations?: PostRelation[]
}

export interface QueryPostsDTO extends QueryChannelPostsDTO {
  groups?: string[],
  access?: SharingAccess[]
}

export interface UpdatePostSharingDTO extends Partial<WithSharing> {}

export interface UpdatePostStatusDTO {
  status: PostStatus
}

export interface UpdatePostDTO {
  title?: string,
  body?: string
}

// // channels

export interface CreateChannelDTO extends WithSettings, WithSharing {}

export interface FindChannelDTO {
  relations?: ChannelRelation[]
}

export interface QueryChannelsDTO extends
  Partial<WithPagination>,
  Partial<WithSorting>,
  Partial<WithTimeQueries>
{
  groups?: string[],
  access?: SharingAccess[],
  relations?: ChannelRelation[]
}

export interface UpdateChannelDTO extends Partial<WithSettings> {}

// // reactions

export interface CreateReactionDTO {
  value: PostReaction;
}

// request options

export interface RequestOptions extends RequestInit {
  authentication?: IAuthenticationManager,
  token?: string,
  portalUrl?: string,
  params?: {
    query?: {
      [key: string]: any
    },
    body?: {
      [key: string]: any
    },
    [key: string]: any
  }
}

// // posts

export interface IQueryPostsOptions extends RequestOptions {
  params: {
    query: QueryPostsDTO
  }
}

export interface IQueryChannelPostsOptions extends RequestOptions {
  params: {
    query: QueryChannelPostsDTO,
    channelId: number
  }
}

export interface ICreatePostOptions extends RequestOptions {
  params: {
    body: CreatePostDTO
  }
}

export interface ICreateChannelPostOptions extends RequestOptions {
  params: {
    body: CreateChannelPostDTO,
    channelId: number
  }
}

export interface ICreateReplyOptions extends RequestOptions {
  params: {
    body: CreatePostDTO,
    postId: number
  }
}

export interface ICreateChannelReplyOptions extends RequestOptions {
  params: {
    body: CreateChannelPostDTO,
    postId: number,
    channelId: number
  }
}

export interface IFindPostOptions extends RequestOptions {
  params: {
    query: FindPostDTO,
    postId: number
  }
}

export interface IFindChannelPostOptions extends RequestOptions {
  params: {
    query: FindPostDTO,
    postId: number,
    channelId: number
  }
}

export interface IUpdatePostOptions extends RequestOptions {
  params: {
    body: UpdatePostDTO,
    postId: number
  }
}

export interface IUpdateChannelPostOptions extends RequestOptions {
  params: {
    body: UpdatePostDTO,
    postId: number,
    channelId: number
  }
}

export interface IUpdatePostSharingOptions extends RequestOptions {
  params: {
    body: UpdatePostSharingDTO,
    postId: number
  }
}

export interface IUpdateChannelPostSharingOptions extends RequestOptions {
  params: {
    body: UpdatePostSharingDTO,
    postId: number,
    channelId: number
  }
}

export interface IUpdatePostStatusOptions extends RequestOptions {
  params: {
    body: UpdatePostStatusDTO,
    postId: number
  }
}

export interface IUpdateChannelPostStatusOptions extends RequestOptions {
  params: {
    body: UpdatePostStatusDTO,
    postId: number,
    channelId: number
  }
}

export interface IDeletePostOptions extends RequestOptions {
  params: {
    postId: number
  }
}

export interface IDeleteChannelPostOptions extends RequestOptions {
  params: {
    postId: number,
    channelId: number
  }
}

// // channels

export interface IQueryChannelsOptions extends RequestOptions {
  params: {
    query: QueryChannelsDTO
  }
}

export interface ICreateChannelOptions extends RequestOptions {
  params: {
    body: CreateChannelDTO
  }
}

export interface IFindChannelOptions extends RequestOptions {
  params: {
    query: FindChannelDTO,
    channelId: number
  }
}

export interface IUpdateChannelOptions extends RequestOptions {
  params: {
    body: UpdateChannelDTO,
    channelId: number
  }
}

export interface IDeleteChannelOptions extends RequestOptions {
  params: {
    channelId: number
  }
}

// // reactions

export interface ICreateReactionOptions extends RequestOptions {
  params: {
    body: CreateReactionDTO,
    postId: number
  }
}

export interface IDeleteReactionOptions extends RequestOptions {
  params: {
    postId: number,
    reactionId: number
  }
}
