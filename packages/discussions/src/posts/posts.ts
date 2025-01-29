/* tslint:disable unified-signatures */
import {
  discussionsApiRequest,
  ISearchPosts,
  SearchPostsFormat,
} from "@esri/hub-common";
import {
  ICreatePostParams,
  ICreateReplyParams,
  IPost,
  ISearchPostsParams,
  IExportPostsParams,
  IFetchPostParams,
  IRemovePostParams,
  IRemovePostResponse,
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
  const url = `/posts/search`;
  return discussionsApiRequest<IPagedResponse<IPost>>(url, {
    ...options,
    data: {
      ...options.data,
    },
    httpMethod: "POST",
  });
}

/**
 * searches for posts and resolves a promise with CSV string representing the results
 *
 * @export
 * @param {IExportPostsParams} options
 * @return {*}  {Promise<string>}
 */
export function exportPosts(options: IExportPostsParams): Promise<string> {
  const url = `/posts/search`;
  return discussionsApiRequest<string>(url, {
    ...options,
    data: {
      ...options.data,
      f: SearchPostsFormat.CSV,
    },
    httpMethod: "POST",
  });
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
  return discussionsApiRequest(url, {
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
  return discussionsApiRequest(url, {
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
  return discussionsApiRequest(url, params);
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
  return discussionsApiRequest(url, options);
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
  return discussionsApiRequest(url, {
    httpMethod: "PATCH",
    ...getCreateUpdateRequestParams(options),
  });
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
  return discussionsApiRequest(url, options);
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
