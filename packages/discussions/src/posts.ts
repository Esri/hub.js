import { request } from "./request";
import {
  IQueryPostsOptions,
  IQueryChannelPostsOptions,
  ICreatePostOptions,
  ICreateChannelPostOptions,
  ICreateReplyOptions,
  ICreateChannelReplyOptions,
  IFetchPostOptions,
  IFetchChannelPostOptions,
  IRemovePostOptions,
  IRemoveChannelPostOptions,
  IUpdatePostOptions,
  IUpdateChannelPostOptions,
  IUpdatePostSharingOptions,
  IUpdateChannelPostSharingOptions,
  IUpdatePostStatusOptions,
  IUpdateChannelPostStatusOptions,
  IPagedResponse,
  IPost,
  IRemovePostResponse
} from "./types";

/**
 * search posts
 *
 * @export
 * @param {(IQueryPostsOptions | IQueryChannelPostsOptions)} options
 * @return {*}  {Promise<IPagedResponse<IPost>>}
 */
export function searchPosts(
  options: IQueryPostsOptions | IQueryChannelPostsOptions
): Promise<IPagedResponse<IPost>> {
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

/**
 * create post
 *
 * @export
 * @param {(ICreatePostOptions | ICreateChannelPostOptions)} options
 * @return {*}  {Promise<IPost>}
 */
export function createPost(
  options: ICreatePostOptions | ICreateChannelPostOptions
): Promise<IPost> {
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

/**
 * create reply to post
 *
 * @export
 * @param {(ICreateReplyOptions | ICreateChannelReplyOptions)} options
 * @return {*}  {Promise<IPost>}
 */
export function createReply(
  options: ICreateReplyOptions | ICreateChannelReplyOptions
): Promise<IPost> {
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

/**
 * fetch post
 *
 * @export
 * @param {(IFetchPostOptions | IFetchChannelPostOptions)} options
 * @return {*}  {Promise<IPost>}
 */
export function fetchPost(
  options: IFetchPostOptions | IFetchChannelPostOptions
): Promise<IPost> {
  let url = `/posts/${options.params.postId}`;
  if (options.params.hasOwnProperty("channelId")) {
    const {
      params: { channelId }
    } = options as IFetchChannelPostOptions;
    url = `/channels/${channelId}` + url;
  }
  options.method = "GET";
  return request(url, options);
}

/**
 * remove post
 *
 * @export
 * @param {(IRemovePostOptions | IRemoveChannelPostOptions)} options
 * @return {*}  {Promise<IRemovePostResponse>}
 */
export function removePost(
  options: IRemovePostOptions | IRemoveChannelPostOptions
): Promise<IRemovePostResponse> {
  let url = `/posts/${options.params.postId}`;
  if (options.params.hasOwnProperty("channelId")) {
    const {
      params: { channelId }
    } = options as IRemoveChannelPostOptions;
    url = `/channels/${channelId}` + url;
  }
  options.method = "DELETE";
  return request(url, options);
}

/**
 * update post
 * NOTE: this method currently only updates a post's title and/or body
 *
 * @export
 * @param {(IUpdatePostOptions | IUpdateChannelPostOptions)} options
 * @return {*}  {Promise<IPost>}
 */
export function updatePost(
  options: IUpdatePostOptions | IUpdateChannelPostOptions
): Promise<IPost> {
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

/**
 * update post channel
 * NOTE: this method will change the channel a post belongs to
 *
 * @export
 * @param {(IUpdatePostSharingOptions | IUpdateChannelPostSharingOptions)} options
 * @return {*}  {Promise<IPost>}
 */
export function updatePostSharing(
  options: IUpdatePostSharingOptions | IUpdateChannelPostSharingOptions
): Promise<IPost> {
  let url = `/posts/${options.params.postId}/sharing`;
  if (options.params.hasOwnProperty("channelId")) {
    const {
      params: { channelId }
    } = options as IUpdateChannelPostSharingOptions;
    url = `/channels/${channelId}` + url;
  }
  options.method = "PATCH";
  return request(url, options);
}

/**
 * update post status
 * NOTE: this method will only update a post's status
 *
 * @export
 * @param {(IUpdatePostStatusOptions | IUpdateChannelPostStatusOptions)} options
 * @return {*}  {Promise<IPost>}
 */
export function updatePostStatus(
  options: IUpdatePostStatusOptions | IUpdateChannelPostStatusOptions
): Promise<IPost> {
  let url = `/posts/${options.params.postId}/status`;
  if (options.params.hasOwnProperty("channelId")) {
    const {
      params: { channelId }
    } = options as IUpdateChannelPostStatusOptions;
    url = `/channels/${channelId}` + url;
  }
  options.method = "PATCH";
  return request(url, options);
}
