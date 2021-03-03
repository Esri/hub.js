import { request } from "./request";
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
} from "./types";

export function searchPosts(
  options: IQueryPostsOptions | IQueryChannelPostsOptions
) {
  let url = `/posts`;
  if (options.params.hasOwnProperty("channelId")) {
    const {
      params: { channelId }
    } = options as IQueryChannelPostsOptions;
    url = `/channels/${channelId}` + url;
  }
  options.method = "GET";
  return request(url, options);
}

export function createPost(
  options: ICreatePostOptions | ICreateChannelPostOptions
) {
  let url = `/posts`;
  if (options.params.hasOwnProperty("channelId")) {
    const {
      params: { channelId }
    } = options as ICreateChannelPostOptions;
    url = `/channels/${channelId}` + url;
  }
  options.method = "POST";
  return request(url, options);
}

export function createReply(
  options: ICreateReplyOptions | ICreateChannelReplyOptions
) {
  let url = `/posts/${options.params.postId}/reply`;
  if (options.params.hasOwnProperty("channelId")) {
    const {
      params: { channelId }
    } = options as ICreateChannelReplyOptions;
    url = `/channels/${channelId}` + url;
  }
  options.method = "POST";
  return request(url, options);
}

export function findPost(options: IFindPostOptions | IFindChannelPostOptions) {
  let url = `/posts/${options.params.postId}`;
  if (options.params.hasOwnProperty("channelId")) {
    const {
      params: { channelId }
    } = options as IFindChannelPostOptions;
    url = `/channels/${channelId}` + url;
  }
  options.method = "GET";
  return request(url, options);
}

export function deletePost(
  options: IDeletePostOptions | IDeleteChannelPostOptions
) {
  let url = `/posts/${options.params.postId}`;
  if (options.params.hasOwnProperty("channelId")) {
    const {
      params: { channelId }
    } = options as IDeleteChannelPostOptions;
    url = `/channels/${channelId}` + url;
  }
  options.method = "DELETE";
  return request(url, options);
}

export function updatePost(
  options: IUpdatePostOptions | IUpdateChannelPostOptions
) {
  let url = `/posts/${options.params.postId}`;
  if (options.params.hasOwnProperty("channelId")) {
    const {
      params: { channelId }
    } = options as IUpdateChannelPostOptions;
    url = `/channels/${channelId}` + url;
  }
  options.method = "PATCH";
  return request(url, options);
}

export function updatePostSharing(
  options: IUpdatePostSharingOptions | IUpdateChannelPostSharingOptions
) {
  let url = `/posts/${options.params.postId}`;
  if (options.params.hasOwnProperty("channelId")) {
    const {
      params: { channelId }
    } = options as IUpdateChannelPostSharingOptions;
    url = `/channels/${channelId}` + url;
  }
  options.method = "PATCH";
  return request(url, options);
}

export function updatePostStatus(
  options: IUpdatePostStatusOptions | IUpdateChannelPostStatusOptions
) {
  let url = `/posts/${options.params.postId}`;
  if (options.params.hasOwnProperty("channelId")) {
    const {
      params: { channelId }
    } = options as IUpdateChannelPostStatusOptions;
    url = `/channels/${channelId}` + url;
  }
  options.method = "PATCH";
  return request(url, options);
}
