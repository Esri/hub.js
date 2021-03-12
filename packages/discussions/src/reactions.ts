import { request } from "./request";
import {
  ICreateReactionOptions,
  IDeleteReactionOptions,
  IDeleteReactionResponse,
  IReaction
} from "./types";

/**
 * create reaction to post
 *
 * @export
 * @param {ICreateReactionOptions} options
 * @return {*}  {Promise<IReaction>}
 */
export function createReaction(
  options: ICreateReactionOptions
): Promise<IReaction> {
  options.method = "POST";
  return request(`/posts/${options.params.postId}/reactions`, options);
}

/**
 * delete reaction
 *
 * @export
 * @param {IDeleteReactionOptions} options
 * @return {*}  {Promise<IDeleteReactionResponse>}
 */
export function deleteReaction(
  options: IDeleteReactionOptions
): Promise<IDeleteReactionResponse> {
  options.method = "DELETE";
  return request(
    `/posts/${options.params.postId}/reactions/${options.params.reactionId}`,
    options
  );
}
