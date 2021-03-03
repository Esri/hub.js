import { request } from './request';
import {
  IQueryPostsOptions,
  IQueryChannelPostsOptions,
  ICreatePostOptions,
  ICreateChannelPostOptions,
  ICreateReplyOptions,
  ICreateChannelReplyOptions,
  IFindPostOptions,
  IFindChannelPostOptions,
  IDeletePostOptions,
  IDeleteChannelPostOptions,
  IUpdatePostOptions,
  IUpdateChannelPostOptions,
  IUpdatePostSharingOptions,
  IUpdateChannelPostSharingOptions,
  IUpdatePostStatusOptions,
  IUpdateChannelPostStatusOptions
} from './types';


export function searchPosts (options: IQueryPostsOptions) {
  return request('/posts', options);
}

export function searchChannelPosts (options: IQueryChannelPostsOptions) {
  return request(`/channels/${options.params.channelId}/posts`, options);
}

export function createPost (options: ICreatePostOptions) {
  return request('/posts', options);
}

export function createChannelPost (options: ICreateChannelPostOptions) {
  return request(`/channels/${options.params.channelId}/posts`, options);
}

export function createReply (options: ICreateReplyOptions) {
  return request(`/posts/${options.params.postId}/reply`, options);
}

export function createChannelReply (options: ICreateChannelReplyOptions) {
  return request(`/channels/${options.params.channelId}/posts/${options.params.postId}/reply`, options);
}

export function findPost (options: IFindPostOptions) {
  return request(`/posts/${options.params.postId}`, options);
}

export function findChannelPost (options: IFindChannelPostOptions) {
  return request(`/channels/${options.params.channelId}/posts/${options.params.postId}`, options);
}

export function deletePost (options: IDeletePostOptions) {
  return request(`/posts/${options.params.postId}`, options);
}

export function deleteChannelPost (options: IDeleteChannelPostOptions) {
  return request(`/channels/${options.params.channelId}/posts/${options.params.postId}`, options);
}

export function updatePost (options: IUpdatePostOptions) {
  return request(`/posts/${options.params.postId}`, options);
}

export function updateChannelPost (options: IUpdateChannelPostOptions) {
  return request(`/channels/${options.params.channelId}/posts/${options.params.postId}`, options);
}

export function updatePostSharing (options: IUpdatePostSharingOptions) {
  return request(`/posts/${options.params.postId}`, options);
}

export function updateChannelPostSharing (options: IUpdateChannelPostSharingOptions) {
  return request(`/channels/${options.params.channelId}/posts/${options.params.postId}`, options);
}

export function updatePostStatus (options: IUpdatePostStatusOptions) {
  return request(`/posts/${options.params.postId}`, options);
}

export function updateChannelPostStatus (options: IUpdateChannelPostStatusOptions) {
  return request(`/channels/${options.params.channelId}/posts/${options.params.postId}`, options);
}