/* tslint:disable unified-signatures */
import {
  discussionsApiRequest,
  discussionsApiRequestV2,
  SearchPostsFormat,
} from "@esri/hub-common";
import {
  ICreatePostParams,
  ICreatePostParamsV2,
  ICreateReplyParams,
  IPost,
  IPostV2,
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
 * @deprecated use searchPostsV2 instead
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
 * @deprecated use exportPostsV2 instead
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
 * @deprecated use createPostV2 instead
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
 * @deprecated use createReplyV2 instead
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
 * @deprecated use fetchPostV2 instead
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
 * @deprecated use removePostV2 instead
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
 * @deprecated use updatePostV2 instead
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
 * @deprecated use updatePostStatusV2 instead
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

/*******************************
 * V2
 *******************************/

/**
 * search posts V2
 *
 * @export
 * @param {ISearchPostsParams} options
 * @return {*}  {Promise<IPagedResponse<IPostV2>>}
 */
export function searchPostsV2(
  options: ISearchPostsParams
): Promise<IPagedResponse<IPostV2>> {
  const url = `/posts/search`;
  return discussionsApiRequestV2<IPagedResponse<IPostV2>>(url, {
    ...options,
    data: {
      ...options.data,
    },
    httpMethod: "POST",
  });
}

/**
 * searches for posts and resolves a promise with CSV string representing the results V2
 *
 * @export
 * @param {IExportPostsParams} options
 * @return {*}  {Promise<string>}
 */
export function exportPostsV2(options: IExportPostsParams): Promise<string> {
  const url = `/posts/search`;
  return discussionsApiRequestV2<string>(url, {
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
 * @param {ICreatePostParamsV2} options
 * @return {*}  {Promise<IPostV2>}
 */
export function createPostV2(options: ICreatePostParamsV2): Promise<IPostV2> {
  const url = `/posts`;
  return discussionsApiRequestV2(url, {
    httpMethod: "POST",
    ...getCreateUpdateRequestParamsV2(options),
  });
}

/**
 * create reply to post
 *
 * @export
 * @param {string} parentId
 * @param {ICreateReplyParams} options
 * @return {*}  {Promise<IPostV2>}
 */
export function createReplyV2(options: ICreateReplyParams): Promise<IPostV2> {
  const url = `/posts/${options.postId}/reply`;
  return discussionsApiRequestV2(url, {
    httpMethod: "POST",
    ...getCreateUpdateRequestParamsV2(options),
  });
}

/**
 * fetch post
 *
 * @export
 * @param {IFetchPostParams} params
 * @return {*}  {Promise<IPostV2>}
 */
export function fetchPostV2(params: IFetchPostParams): Promise<IPostV2> {
  const url = `/posts/${params.postId}`;
  params.httpMethod = "GET";
  return discussionsApiRequestV2(url, params);
}

/**
 * remove post
 *
 * @export
 * @param {IRemovePostParams} options
 * @return {*}  {Promise<IRemovePostResponse>}
 */
export function removePostV2(
  options: IRemovePostParams
): Promise<IRemovePostResponse> {
  const url = `/posts/${options.postId}`;
  options.httpMethod = "DELETE";
  return discussionsApiRequestV2(url, options);
}

/**
 * update post
 * NOTE: this method currently only update post.title and post.body
 *
 * @export
 * @param {IUpdatePostParams} options
 * @return {*}  {Promise<IPostV2>}
 */
export function updatePostV2(options: IUpdatePostParams): Promise<IPostV2> {
  const url = `/posts/${options.postId}`;
  return discussionsApiRequestV2(url, {
    httpMethod: "PATCH",
    ...getCreateUpdateRequestParamsV2(options),
  });
}

/**
 * update post status
 * NOTE: this method will only update a post's status
 *
 * @export
 * @param {IUpdatePostStatusParams} options
 * @return {*}  {Promise<IPostV2>}
 */
export function updatePostStatusV2(
  options: IUpdatePostStatusParams
): Promise<IPostV2> {
  const url = `/posts/${options.postId}/status`;
  options.httpMethod = "PATCH";
  return discussionsApiRequestV2(url, options);
}

/**
 * Builds the necessary request options for post/reply create/update requests
 * @param mentionUrl
 */
function getCreateUpdateRequestParamsV2<
  T extends IUpdatePostParams | ICreatePostParamsV2 | ICreateReplyParams
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
