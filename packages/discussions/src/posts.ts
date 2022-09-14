/* tslint:disable unified-signatures */
import { request } from "./request";
import {
  ISearchPostsOptions,
  ICreatePostOptions,
  ICreateReplyOptions,
  IFetchPostOptions,
  IRemovePostOptions,
  IUpdatePostOptions,
  IUpdatePostSharingOptions,
  IUpdatePostStatusOptions,
  IPagedResponse,
  IPost,
  IRemovePostResponse,
} from "./types";

/**
 * search posts
 *
 * @export
 * @param {ISearchPostsOptions} options
 * @return {*}  {Promise<IPagedResponse<IPost>>}
 */
export function searchPosts(
  options: ISearchPostsOptions
): Promise<IPagedResponse<IPost>> {
  const url = `/posts`;
  options.httpMethod = "GET";
  return request(url, options);
}

/**
 * create post
 *
 * @export
 * @param {ICreatePostOptions} options
 * @return {*}  {Promise<IPost>}
 */
export function createPost(options: ICreatePostOptions): Promise<IPost> {
  const url = `/posts`;
  return request(url, {
    httpMethod: "POST",
    ...getCreateUpdateRequestOptions(options),
  });
}

/**
 * create reply to post
 *
 * @export
 * @param {ICreateReplyOptions} options
 * @return {*}  {Promise<IPost>}
 */
export function createReply(options: ICreateReplyOptions): Promise<IPost> {
  const url = `/posts/${options.postId}/reply`;
  return request(url, {
    httpMethod: "POST",
    ...getCreateUpdateRequestOptions(options),
  });
}

/**
 * fetch post
 *
 * @export
 * @param {IFetchPostOptions} options
 * @return {*}  {Promise<IPost>}
 */
export function fetchPost(options: IFetchPostOptions): Promise<IPost> {
  const url = `/posts/${options.postId}`;
  options.httpMethod = "GET";
  return request(url, options);
}

/**
 * remove post
 *
 * @export
 * @param {IRemovePostOptions} options
 * @return {*}  {Promise<IRemovePostResponse>}
 */
export function removePost(
  options: IRemovePostOptions
): Promise<IRemovePostResponse> {
  const url = `/posts/${options.postId}`;
  options.httpMethod = "DELETE";
  return request(url, options);
}

/**
 * update post
 * NOTE: this method currently only update post.title and post.body
 *
 * @export
 * @param {IUpdatePostOptions} options
 * @return {*}  {Promise<IPost>}
 */
export function updatePost(options: IUpdatePostOptions): Promise<IPost> {
  const url = `/posts/${options.postId}`;
  return request(url, {
    httpMethod: "PATCH",
    ...getCreateUpdateRequestOptions(options),
  });
}

/**
 * update post channel
 * NOTE: this method will change the channel a post belongs to
 *
 * @export
 * @param {IUpdatePostSharingOptions} options
 * @return {*}  {Promise<IPost>}
 */
export function updatePostSharing(
  options: IUpdatePostSharingOptions
): Promise<IPost> {
  const url = `/posts/${options.postId}/sharing`;
  options.httpMethod = "PATCH";
  return request(url, options);
}

/**
 * update post status
 * NOTE: this method will only update a post's status
 *
 * @export
 * @param {IUpdatePostStatusOptions} options
 * @return {*}  {Promise<IPost>}
 */
export function updatePostStatus(
  options: IUpdatePostStatusOptions
): Promise<IPost> {
  const url = `/posts/${options.postId}/status`;
  options.httpMethod = "PATCH";
  return request(url, options);
}

/**
 * Builds the necessary request options for post/reply create/update requests
 * @param mentionUrl
 */
function getCreateUpdateRequestOptions<
  T extends IUpdatePostOptions | ICreatePostOptions | ICreateReplyOptions
>(options: T): T {
  const { mentionUrl, ...requestOptions } = options;
  if (mentionUrl) {
    requestOptions.headers = {
      ...requestOptions.headers,
      "mention-url": mentionUrl,
    };
  }
  return requestOptions as T;
}
