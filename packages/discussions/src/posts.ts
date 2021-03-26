/* tslint:disable unified-signatures */
import { request } from "./request";
import {
  ISearchPostsOptions,
  ISearchChannelPostsOptions,
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
 * @param {(ISearchPostsOptions | ISearchChannelPostsOptions)} options
 * @return {*}  {Promise<IPagedResponse<IPost>>}
 */
export function searchPosts(
  options: ISearchPostsOptions
): Promise<IPagedResponse<IPost>>;
export function searchPosts(
  options: ISearchChannelPostsOptions
): Promise<IPagedResponse<IPost>>;
export function searchPosts(
  options: ISearchPostsOptions | ISearchChannelPostsOptions
): Promise<IPagedResponse<IPost>> {
  let url = `/posts`;
  if (options.hasOwnProperty("channelId")) {
    const { channelId } = options as ISearchChannelPostsOptions;
    url = `/channels/${channelId}` + url;
  }
  options.httpMethod = "GET";
  return request(url, options);
}

/**
 * create post
 *
 * @export
 * @param {(ICreatePostOptions | ICreateChannelPostOptions)} options
 * @return {*}  {Promise<IPost>}
 */
export function createPost(options: ICreatePostOptions): Promise<IPost>;
export function createPost(options: ICreateChannelPostOptions): Promise<IPost>;
export function createPost(
  options: ICreatePostOptions | ICreateChannelPostOptions
): Promise<IPost> {
  let url = `/posts`;
  if (options.hasOwnProperty("channelId")) {
    const { channelId } = options as ICreateChannelPostOptions;
    url = `/channels/${channelId}` + url;
  }
  options.httpMethod = "POST";
  return request(url, options);
}

/**
 * create reply to post
 *
 * @export
 * @param {(ICreateReplyOptions | ICreateChannelReplyOptions)} options
 * @return {*}  {Promise<IPost>}
 */
export function createReply(options: ICreateReplyOptions): Promise<IPost>;
export function createReply(
  options: ICreateChannelReplyOptions
): Promise<IPost>;
export function createReply(
  options: ICreateReplyOptions | ICreateChannelReplyOptions
): Promise<IPost> {
  let url = `/posts/${options.postId}/reply`;
  if (options.hasOwnProperty("channelId")) {
    const { channelId } = options as ICreateChannelReplyOptions;
    url = `/channels/${channelId}` + url;
  }
  options.httpMethod = "POST";
  return request(url, options);
}

/**
 * fetch post
 *
 * @export
 * @param {(IFetchPostOptions | IFetchChannelPostOptions)} options
 * @return {*}  {Promise<IPost>}
 */
export function fetchPost(options: IFetchPostOptions): Promise<IPost>;
export function fetchPost(options: IFetchChannelPostOptions): Promise<IPost>;
export function fetchPost(
  options: IFetchPostOptions | IFetchChannelPostOptions
): Promise<IPost> {
  let url = `/posts/${options.postId}`;
  if (options.hasOwnProperty("channelId")) {
    const { channelId } = options as IFetchChannelPostOptions;
    url = `/channels/${channelId}` + url;
  }
  options.httpMethod = "GET";
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
  options: IRemovePostOptions
): Promise<IRemovePostResponse>;
export function removePost(
  options: IRemoveChannelPostOptions
): Promise<IRemovePostResponse>;
export function removePost(
  options: IRemovePostOptions | IRemoveChannelPostOptions
): Promise<IRemovePostResponse> {
  let url = `/posts/${options.postId}`;
  if (options.hasOwnProperty("channelId")) {
    const { channelId } = options as IRemoveChannelPostOptions;
    url = `/channels/${channelId}` + url;
  }
  options.httpMethod = "DELETE";
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
export function updatePost(options: IUpdatePostOptions): Promise<IPost>;
export function updatePost(options: IUpdateChannelPostOptions): Promise<IPost>;
export function updatePost(
  options: IUpdatePostOptions | IUpdateChannelPostOptions
): Promise<IPost> {
  let url = `/posts/${options.postId}`;
  if (options.hasOwnProperty("channelId")) {
    const { channelId } = options as IUpdateChannelPostOptions;
    url = `/channels/${channelId}` + url;
  }
  options.httpMethod = "PATCH";
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
  options: IUpdatePostSharingOptions
): Promise<IPost>;
export function updatePostSharing(
  options: IUpdateChannelPostSharingOptions
): Promise<IPost>;
export function updatePostSharing(
  options: IUpdatePostSharingOptions | IUpdateChannelPostSharingOptions
): Promise<IPost> {
  let url = `/posts/${options.postId}/sharing`;
  if (options.hasOwnProperty("channelId")) {
    const { channelId } = options as IUpdateChannelPostSharingOptions;
    url = `/channels/${channelId}` + url;
  }
  options.httpMethod = "PATCH";
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
  options: IUpdatePostStatusOptions
): Promise<IPost>;
export function updatePostStatus(
  options: IUpdateChannelPostStatusOptions
): Promise<IPost>;
export function updatePostStatus(
  options: IUpdatePostStatusOptions | IUpdateChannelPostStatusOptions
): Promise<IPost> {
  let url = `/posts/${options.postId}/status`;
  if (options.hasOwnProperty("channelId")) {
    const { channelId } = options as IUpdateChannelPostStatusOptions;
    url = `/channels/${channelId}` + url;
  }
  options.httpMethod = "PATCH";
  return request(url, options);
}
