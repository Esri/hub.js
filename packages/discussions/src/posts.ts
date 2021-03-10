import { request } from "./request";
import {
  IQueryPostsOptions,
  IQueryChannelPostsOptions,
  ICreatePostOptions,
  ICreateChannelPostOptions,
  ICreateReplyOptions,
  ICreateChannelReplyOptions,
  IGetPostOptions,
  IGetChannelPostOptions,
  IDeletePostOptions,
  IDeleteChannelPostOptions,
  IUpdatePostOptions,
  IUpdateChannelPostOptions,
  IUpdatePostSharingOptions,
  IUpdateChannelPostSharingOptions,
  IUpdatePostStatusOptions,
  IUpdateChannelPostStatusOptions,
  INestPagination,
  IPostDTO,
  INestDeleteResult
} from "./types";

/**
 * search posts
 *
 * @export
 * @param {(IQueryPostsOptions | IQueryChannelPostsOptions)} options
 * @return {*}  {Promise<INestPagination<IPostDTO>>}
 */
export function searchPosts(
  options: IQueryPostsOptions | IQueryChannelPostsOptions
): Promise<INestPagination<IPostDTO>> {
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
 * @return {*}  {Promise<IPostDTO>}
 */
export function createPost(
  options: ICreatePostOptions | ICreateChannelPostOptions
): Promise<IPostDTO> {
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
 * @return {*}  {Promise<IPostDTO>}
 */
export function createReply(
  options: ICreateReplyOptions | ICreateChannelReplyOptions
): Promise<IPostDTO> {
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
 * get post
 *
 * @export
 * @param {(IGetPostOptions | IGetChannelPostOptions)} options
 * @return {*}  {Promise<IPostDTO>}
 */
export function getPost(
  options: IGetPostOptions | IGetChannelPostOptions
): Promise<IPostDTO> {
  let url = `/posts/${options.params.postId}`;
  if (options.params.hasOwnProperty("channelId")) {
    const {
      params: { channelId }
    } = options as IGetChannelPostOptions;
    url = `/channels/${channelId}` + url;
  }
  options.method = "GET";
  return request(url, options);
}

/**
 * delete post
 *
 * @export
 * @param {(IDeletePostOptions | IDeleteChannelPostOptions)} options
 * @return {*}  {Promise<INestDeleteResult>}
 */
export function deletePost(
  options: IDeletePostOptions | IDeleteChannelPostOptions
): Promise<INestDeleteResult> {
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

/**
 * update post
 * NOTE: this method only updates a post's title and/or body
 *
 * @export
 * @param {(IUpdatePostOptions | IUpdateChannelPostOptions)} options
 * @return {*}  {Promise<IPostDTO>}
 */
export function updatePost(
  options: IUpdatePostOptions | IUpdateChannelPostOptions
): Promise<IPostDTO> {
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
 * @return {*}  {Promise<IPostDTO>}
 */
export function updatePostSharing(
  options: IUpdatePostSharingOptions | IUpdateChannelPostSharingOptions
): Promise<IPostDTO> {
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

/**
 * update post status
 * NOTE: this method will only update a post's status
 *
 * @export
 * @param {(IUpdatePostStatusOptions | IUpdateChannelPostStatusOptions)} options
 * @return {*}  {Promise<IPostDTO>}
 */
export function updatePostStatus(
  options: IUpdatePostStatusOptions | IUpdateChannelPostStatusOptions
): Promise<IPostDTO> {
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
