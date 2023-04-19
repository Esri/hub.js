/* tslint:disable unified-signatures */
import { request } from "../request";
import {
  ICreatePostParams,
  ICreateReplyParams,
  IPost,
  ISearchPostsParams,
  IFetchPostParams,
  IRemovePostParams,
  IRemovePostResponse,
  IUpdatePostSharingParams,
  IUpdatePostParams,
  IUpdatePostStatusParams,
  IPagedResponse,
} from "../types";

/**
 * search posts
 *
 * @export
 * @param {ISearchPostsParams} options
 * @return {*}  {Promise<IPagedResponse<IPost>>}
 */
export function searchPosts(
  options: ISearchPostsParams
): Promise<IPagedResponse<IPost>> {
  const url = `/posts`;
  options.httpMethod = "GET";
  // need to serialize geometry and featureGeometry since this
  // is a GET request. we should consider requiring this to be
  // a base64 string to safeguard against large geometries that
  // will exceed URL character limits
  const data = ["geometry", "featureGeometry"].reduce(
    (acc, property) =>
      acc[property]
        ? { ...acc, [property]: JSON.stringify(acc[property]) }
        : acc,
    { ...(options.data ?? {}) } as any
  );
  return request(url, { ...options, data });
}

/**
 * create post
 *
 * @export
 * @param {ICreatePostParams} options
 * @return {*}  {Promise<IPost>}
 */
export function createPost(options: ICreatePostParams): Promise<IPost> {
  const url = `/posts`;
  return request(url, {
    httpMethod: "POST",
    ...getCreateUpdateRequestParams(options),
  });
}

/**
 * create reply to post
 *
 * @export
 * @param {string} parentId
 * @param {ICreateReplyParams} options
 * @return {*}  {Promise<IPost>}
 */
export function createReply(options: ICreateReplyParams): Promise<IPost> {
  const url = `/posts/${options.postId}/reply`;
  return request(url, {
    httpMethod: "POST",
    ...getCreateUpdateRequestParams(options),
  });
}

/**
 * fetch post
 *
 * @export
 * @param {IFetchPostParams} params
 * @return {*}  {Promise<IPost>}
 */
export function fetchPost(params: IFetchPostParams): Promise<IPost> {
  const url = `/posts/${params.postId}`;
  params.httpMethod = "GET";
  return request(url, params);
}

/**
 * remove post
 *
 * @export
 * @param {IRemovePostParams} options
 * @return {*}  {Promise<IRemovePostResponse>}
 */
export function removePost(
  options: IRemovePostParams
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
 * @param {IUpdatePostParams} options
 * @return {*}  {Promise<IPost>}
 */
export function updatePost(options: IUpdatePostParams): Promise<IPost> {
  const url = `/posts/${options.postId}`;
  return request(url, {
    httpMethod: "PATCH",
    ...getCreateUpdateRequestParams(options),
  });
}

/**
 * update post channel
 * NOTE: this method will change the channel a post belongs to
 *
 * @export
 * @param {IUpdatePostSharingParams} options
 * @return {*}  {Promise<IPost>}
 */
export function updatePostSharing(
  options: IUpdatePostSharingParams
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
 * @param {IUpdatePostStatusParams} options
 * @return {*}  {Promise<IPost>}
 */
export function updatePostStatus(
  options: IUpdatePostStatusParams
): Promise<IPost> {
  const url = `/posts/${options.postId}/status`;
  options.httpMethod = "PATCH";
  return request(url, options);
}

/**
 * Builds the necessary request options for post/reply create/update requests
 * @param mentionUrl
 */
function getCreateUpdateRequestParams<
  T extends IUpdatePostParams | ICreatePostParams | ICreateReplyParams
>(params: T): T {
  const { mentionUrl, ...requestOptions } = params;
  if (mentionUrl) {
    requestOptions.headers = {
      ...requestOptions.headers,
      "mention-url": mentionUrl,
    };
  }
  return requestOptions as T;
}
